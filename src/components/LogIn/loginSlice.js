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
    reducers: {
        logout: state => {
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