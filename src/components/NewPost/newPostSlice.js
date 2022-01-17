import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reddit from "../../utilities/redditAPI";

export const communitySearch = createAsyncThunk(
    'newPost/communitySearch',
    async (params) => {
        const { search, limit, over18 } = params;
        const results = await reddit.fetchSubredditSearch(search, limit, '', over18);
        return results;
    }
)

export const submitPost = createAsyncThunk(
    'newPost/submitPost',
    async (params) => {
        const post = await reddit.submitNewPost(params);
        return post;
    }
)

export const newPostSlice = createSlice({
    name: 'newPost',
    initialState: {
        lastPost: {},
        submit: {
            isLoading: false,
            hasError: false
        },
        open: false,
        community: {
            search: '',
            results: {},
            selected: {},
            isLoading: false,
            hasError: false
        },
        params: {
            api_type: 'json',
            kind: 'self',
            nsfw: false,
            spoiler: false,
            original_content: false,
            sendreplies: true,
            sr: '',
            submit_type: 'subreddit',
            text: '',
            title: '',
            url: '',
            validate_on_submit: true
        }
    },
    reducers: {
        openNewPost: (state) => {
            state.open = true;
        },
        closeNewPost: (state) => {
            state.open = false;
        },
        toggleNewPost: (state) => {
            state.open ? state.open = false : state.open = true;
        },
        handleCommunityChange: (state, action) => {
            state.community.search = action.payload
        },
        clearSearchResults: (state) => {
            state.community.results = {};
        },
        setSelectedSubreddit: (state, action) => {
            state.community.selected = action.payload;
            action.payload.data ? state.params.sr = action.payload.data.display_name : state.params.sr = action.payload.subreddit.display_name;
        },
        clearSelectedSubreddit: (state) => {
            state.community.selected = {};
            state.params.sr = '';
        },
        handleChange: (state, action) => {
            const { key, value } = action.payload;
            state.params[key] = value;
        },
        setPostKind: (state, action) => {
            state.params.kind = action.payload;
        },
        toggleBooleanParams: (state, action) => {
            const param = action.payload;
            state.params[param] ? state.params[param] = false : state.params[param] = true;
        },
        resetSubmit: (state) => {
            state.community = {search: '', results: {}, selected: {}, isLoading: false, hasError: false}
            state.params = {
                    api_type: 'json',
                    kind: 'self',
                    nsfw: false,
                    spoiler: false,
                    original_content: false,
                    sendreplies: true,
                    sr: '',
                    submit_type: 'subreddit',
                    text: '',
                    title: '',
                    url: '',
                    validate_on_submit: true
            }
        },
        clearLastPost: (state) => {
            state.lastPost = {};
        }
    },
    extraReducers: {
        [communitySearch.pending]: (state) => {
            state.community.isLoading = true;
            state.community.hasError = false;
        },
        [communitySearch.fulfilled]: (state, action) => {
            state.community.isLoading = false;
            state.community.hasError = false;
            state.community.results = action.payload.data.children;
        },
        [communitySearch.rejected]: (state, action) => {
            state.community.isLoading = false;
            state.community.hasError = true;
        },
        [submitPost.pending]: (state) => {
            state.community.isLoading = true;
            state.community.hasError = false;
        },
        [submitPost.fulfilled]: (state, action) => {
            state.community.isLoading = false;
            state.community.hasError = false;
            state.lastPost = action.payload;
        },
        [submitPost.rejected]: (state, action) => {
            state.community.isLoading = false;
            state.community.hasError = true;
        },
    }
});

export const { 
    openNewPost, closeNewPost, 
    toggleNewPost, handleChange, 
    setPostKind, toggleBooleanParams, 
    handleCommunityChange, clearSearchResults ,
    setSelectedSubreddit, clearSelectedSubreddit,
    resetSubmit, clearLastPost
} = newPostSlice.actions;

export const selectNewPost = (state) => state.newPost;

export default newPostSlice.reducer;