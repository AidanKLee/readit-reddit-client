import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const fetchSearch = createAsyncThunk(
    'searchBar/fetchSearch',
    async (params) => {
        const { search, limit, over18} = params;
        const results = await reddit.fetchSearch(search, limit, over18);
        return results;
    }
)

export const fetchSubredditSearch = createAsyncThunk(
    'searchBar/fetchSubredditSearch',
    async (params) => {
        const { search, limit, over18} = params;
        const results = await reddit.fetchSubredditSearch(search, limit, over18);
        return results;
    }
)

export const fetchUsersSearch = createAsyncThunk(
    'searchBar/fetchUsersSearch',
    async (params) => {
        const { search, limit, over18} = params;
        const results = await reddit.fetchUsersSearch(search, limit, over18);
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
        users: {},
        usersAreLoading: false,
        usersHasError: false,
    },
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
        },
        setInitialSearchBarState: (state) => {
            state.search = ''
            state.results = {}
            state.subreddits = {}
            state.users = {}
        }
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
        },
        [fetchUsersSearch.pending] : (state) => {
            state.usersAreLoading = true;
            state.usersHasError = false;
        },
        [fetchUsersSearch.fulfilled]: (state, action) => {
            state.usersAreLoading = false;
            state.usersHasError = false;
            state.users = action.payload;
        },
        [fetchUsersSearch.rejected]: (state) => {
            state.usersAreLoading = false;
            state.usersHasError = true;
        }
    }
});

export const { search, setInitialSearchBarState } = searchBarSlice.actions;

export const selectSearchBar = state => {
    return state.searchBar;
};

export default searchBarSlice.reducer;