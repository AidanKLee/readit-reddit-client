import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const fetchSearch = createAsyncThunk(
    'searchBar/fetchSearch',
    async (search) => {
        const results = reddit.fetchSearch(search);
        return results;
    }
)

export const fetchSubredditSearch = createAsyncThunk(
    'searchBar/fetchSubredditSearch',
    async (search) => {
        const results = reddit.fetchSubredditSearch(search);
        return results;
    }
)

export const searchBarSlice = createSlice({
    name: 'searchBar',
    initialState: {
        search: '',
        results: {},
        resultsAreLoading: false,
        resultsHasError: false,
        subreddits: {},
        subrettitsAreLoading: false,
        subrettitsHasError: false,
    },
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: {
        [fetchSearch.pending] : (state) => {
            state.resultsAreLoading = true;
            state.resultsHasError = false;
        },
        [fetchSearch.fulfilled]: (state, action) => {
            state.resultsAreLoading = false;
            state.resultsHasError = false;
            state.results = action.payload;
        },
        [fetchSearch.rejected]: (state) => {
            state.resultsAreLoading = false;
            state.resultsHasError = true;
        },
        [fetchSubredditSearch.pending] : (state) => {
            state.subrettitsAreLoading = true;
            state.subrettitsHasError = false;
        },
        [fetchSubredditSearch.fulfilled]: (state, action) => {
            state.subrettitsAreLoading = false;
            state.subrettitsHasError = false;
            state.subreddits = action.payload;
        },
        [fetchSubredditSearch.rejected]: (state) => {
            state.subrettitsAreLoading = false;
            state.subrettitsHasError = true;
        }
    }
});

export const { search } = searchBarSlice.actions;

export const selectSearchBar = state => {
    return state.searchBar;
};

export default searchBarSlice.reducer;