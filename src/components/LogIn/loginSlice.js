import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const handleLogin = createAsyncThunk(
    'login/handleLogin',
    async () => {
        const code = reddit.handleCallback();
        if (code) {
            const accessToken = await reddit.fetchToken(code);
            return accessToken;
        }
    }
);

const sliceOptions = {
    name: 'login',
    initialState: {
        authorization: {},
        isLoading: false,
        hasError: false
    },
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
};

export const loginSlice = createSlice(sliceOptions);

export const authorization = state => state.authorization;

export default loginSlice.reducer;