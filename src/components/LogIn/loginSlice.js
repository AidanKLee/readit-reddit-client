import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const handleLogin = createAsyncThunk(
    'login/handleLogin',
    async () => {
        let accessToken;
        const prevRefreshToken = localStorage.getItem('refreshToken');
        const code = reddit.handleCallback();
        if (code) {
            accessToken = await reddit.fetchToken(code);
        } else if (prevRefreshToken) {
            accessToken = await reddit.refreshAccessToken(atob(prevRefreshToken));
        }
        if (accessToken) {
            const user = await reddit.fetchUser();
            
            const communities = await reddit.fetchCommunities();

            return {
                accessToken: accessToken,
                user: user,
                communities: communities,
                votes: await reddit.fetchVotes(user.name),
                settings: await reddit.fetchAccountSettings()
            }
        }
    }
);

export const updateVotes = createAsyncThunk(
    'login/updateVotes',
    async (name) => {
        const votes = await reddit.fetchVotes(name);
        return votes;
    }
)

export const fetchModeratedSubreddits = createAsyncThunk(
    'main/fetchModeratedSubreddits',
    async (user) => {
        user = `/user/${user}/`
        const data = await reddit.fetchModeratorOf(user);
        return data.data
    }
)

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        imageUpload: {
            open: true,
            upload_type: '',
            subreddit: ''
        }
    },
    reducers: {
        logout: state => {
            localStorage.removeItem('refreshToken');
            return state = {
                isLoading: state.isLoading,
                hasError: state.hasError,
                initialLoginAttempt: true,
            };
        },
        setSettings: (state, action) => {
            state.authorization.settings = action.payload;
        },
        setSubscribed: (state, action) => {
            state.authorization.communities.data.children = action.payload
        },
        toggleImageUpload: (state, action) => {
            console.log(action.payload)
            if (state.imageUpload.open) {
                state.imageUpload = {
                    open: false,
                    upload_type: '',
                    subreddit: ''
                }
            } else {
                state.imageUpload = {
                    open: true,
                    upload_type: action.payload.upload_type,
                    subreddit: action.payload.subreddit
                }
            }
        }
    },
    extraReducers: {
        [handleLogin.pending]: (state) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [handleLogin.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            state.authorization = action.payload;
            if (action.payload !== undefined) {
                localStorage.setItem('refreshToken', btoa(action.payload.accessToken.refreshToken));
            }
            state.initialLoginAttempt = true;
        },
        [handleLogin.rejected]: (state) => {
            state.isLoading = false;
            state.hasError = true;
        },
        [updateVotes.pending]: (state) => {
            state.votesAreLoading = true;
            state.votesHaveError = false;
        },
        [updateVotes.fulfilled]: (state, action) => {
            state.votesAreLoading = false;
            state.votesHaveError = false;
            state.authorization.votes = action.payload;
        },
        [updateVotes.rejected]: (state) => {
            state.votesAreLoading = false;
            state.votesHaveError = true;
        },
        [fetchModeratedSubreddits.pending]: (state) => {
            state.moderatedIsLoading = true;
            state.moderatedsHasError = false;
        },
        [fetchModeratedSubreddits.fulfilled]: (state, action) => {
            state.moderatedIsLoading = false;
            state.moderatedHasError = false;
            state.authorization.moderated = action.payload;
        },
        [fetchModeratedSubreddits.rejected]: (state) => {
            state.moderatedIsLoading = false;
            state.moderatedHasError = true;
        },
    }
});

export const { logout, setSettings, setSubscribed, setAuthorization, setInitialLoginAttempt, toggleImageUpload } = loginSlice.actions;

export const selectLogin = state => {
    return state.login;
};

export default loginSlice.reducer;