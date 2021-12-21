import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const handleLogin = createAsyncThunk(
    'login/handleLogin',
    async () => {
        const code = reddit.handleCallback();
        let accessToken;
        if (code) {
            accessToken = await reddit.fetchToken(code);
        }
        if (accessToken) {
            const user = await reddit.fetchUser();
            return {
                accessToken: accessToken,
                user: user
            }
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState: {},
    reducers: {},
    extraReducers: {
        [handleLogin.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [handleLogin.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            state.authorization = action.payload;
        },
        [handleLogin.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const login = state => state;

export default loginSlice.reducer;