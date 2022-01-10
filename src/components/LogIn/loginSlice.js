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
            accessToken = await reddit.refreshAccessToken(prevRefreshToken);
        }
        if (accessToken) {
            const user = await reddit.fetchUser();
            const communities = await reddit.fetchCommunities();
            return {
                accessToken: accessToken,
                user: user,
                communities: communities
            }
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState: {},
    reducers: {
        logout: state => {
            localStorage.clear();
            return state = {
                isLoading: state.isLoading,
                hasError: state.hasError
            };
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
                localStorage.setItem('refreshToken', action.payload.accessToken.refreshToken)
            }
            
        },
        [handleLogin.rejected]: (state) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const { logout } = loginSlice.actions;

export const selectLogin = state => {
    return state.login;
};

export default loginSlice.reducer;