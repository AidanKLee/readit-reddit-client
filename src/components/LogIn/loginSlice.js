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
                settings: await reddit.fetchAccountSettings()
            }
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState: {},
    reducers: {
        logout: state => {
            localStorage.removeItem('refreshToken');
            return state = {
                isLoading: state.isLoading,
                hasError: state.hasError,
                initialLoginAttempt: true
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
                localStorage.setItem('refreshToken', btoa(action.payload.accessToken.refreshToken))
            }
            state.initialLoginAttempt = true;
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