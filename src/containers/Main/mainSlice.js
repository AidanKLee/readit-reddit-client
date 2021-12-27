import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const fetchContent = createAsyncThunk(
    'main/fetchContent',
    async (params) => {
        const { limit, url = 'best', after, before } = params;
        const content = {
            url: url,
            content: await reddit.fetchContent(limit, url, after, before)
        }
        return content;
    }
)

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        page: {},
        isLoading: false,
        hasError: false
    },
    reducers: {},
    extraReducers: {
        [fetchContent.pending] : (state) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [fetchContent.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            if (!state.page) {
                state.page = action.payload;
            } else if (state.page.url !== action.payload.url) {
                state.page = action.payload;
            } else if (state.page.url === action.payload.url) {
                action.payload.content.data.children.forEach(child => {
                    state.page.content.data.children = [
                        ...state.page.content.data.children,
                        child
                    ];
                });
            };
        },
        [fetchContent.rejected]: (state) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const selectMain = state => state.main;

export default mainSlice.reducer;