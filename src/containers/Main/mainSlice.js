import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reddit from '../../utilities/redditAPI';

export const fetchContent = createAsyncThunk(
    'main/fetchContent',
    async (params) => {
        const { limit, url = 'best', after, before, loggedIn } = params;
        let data;
        if (loggedIn && (url === 'best'|| url === 'hot' || url === 'new' || url === 'top' || url === 'rising')) {
            data = await reddit.fetchUserHome(limit, url, after, before);
        } else {
            data = await reddit.fetchContent(limit, url, after, before);
        }
        if (data.data.children.length > 25) {
            data.data.children = data.data.children.slice(0, 25)
        }
        const content = {
            url: url,
            content: data,
            comments: [],
            subreddits: []
        }
        return content;
    }
)

export const fetchComments = createAsyncThunk(
    'main/fetchComments',
    async ({comments}) => {
        const data = await Promise.all(comments.map(async comment => {
            const newComment = await reddit.fetchComment(comment.data.permalink);
            return newComment;
        }));

        const content = {
            comments: data
        }

        return content;
    }
)

export const fetchSubreddits = createAsyncThunk(
    'main/fetchSubreddits',
    async ({subreddits}) => {
        const data = await Promise.all(subreddits.map(async subreddit => {
            let name = subreddit.data.subreddit_name_prefixed
            if (subreddit.data.subreddit_name_prefixed.includes('u/')) {
                name = name.replace('u/', 'user/')
            }
            const newSubreddit = await reddit.fetchSubreddit(name);
            return newSubreddit;
        }));

        const content = {
            subreddits: data
        }

        return content
    }
)

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        page: {
            content: [],
            comments: [],
            subreddits: [],
            article: {},
            url: '',
            newComment: {}
        },
        isLoading: false,
        hasError: false,
        contentReady: false,
        commentsAreLoading: false,
        commentsHasError: false,
        subredditsAreLoading: false,
        subredditsHasError: false
    },
    reducers: {
        setArticle: (state, action) => {
            state.page.article = action.payload;
        },
        clearState: (state) => {
            state.page = {
                ...state.page,
                comments: [],
                content: [],
                subreddits: [],
                article: {},
                url: ''
            }
        },
        showNewPost: (state, action) => {
            const { content, comment, subreddit } = action.payload;
            state.content = {...state.content, content};
            state.comments = {...state.comments, comment};
            state.subreddits = {...state.subreddits, subreddit}
        },
        showNewComment: (state, action) => {
            state.page.newComment = action.payload
        }
    },
    extraReducers: {
        [fetchContent.pending] : (state) => {
            state.isLoading = true;
            state.hasError = false;
            state.contentReady = false;
        },
        [fetchContent.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            if (state.page.url !== action.payload.url) {
                state.page = action.payload;
                state.page.allLoaded = false;
                if (action.payload.content.data.children.length < 25) {
                    state.page.allLoaded = true;
                }
            } else if (state.page.url === action.payload.url) {
                state.page.content.data.children = state.page.content.data.children.concat(action.payload.content.data.children);
                state.page.allLoaded = false;
                if (action.payload.content.data.children.length < 25) {
                    state.page.allLoaded = true;
                }
                // action.payload.content.data.children.forEach(child => {
                //     let match = false;
                //     state.page.content.data.children.forEach(entry => {
                //         if (entry.data.name === child.data.name) {
                //             match = true;
                //         }
                //     })
                //     if (!match) {
                //         state.page.content.data.children = [
                //             ...state.page.content.data.children,
                //             child
                //         ];
                //     }
                // });
            };
            state.contentReady = true;
        },
        [fetchContent.rejected]: (state) => {
            state.isLoading = false;
            state.hasError = true;
            state.contentReady = false;
        },

        [fetchComments.pending] : (state) => {
            state.commentsAreLoading = true;
            state.commentsHasError = false;
            state.contentReady = false;
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.commentsAreLoading = false;
            state.commentsHasError = false;
            action.payload.comments.forEach(comment => {
                state.page.comments = [...state.page.comments, comment[1].data.children]
            });
            state.contentReady = false;
        },
        [fetchComments.rejected]: (state) => {
            state.commentsAreLoading = false;
            state.commentsHasError = true;
            state.contentReady = false;
        },

        [fetchSubreddits.pending] : (state) => {
            state.subredditsAreLoading = true;
            state.subredditsHasError = false;
            state.contentReady = false;
        },
        [fetchSubreddits.fulfilled]: (state, action) => {
            state.subredditsAreLoading = false;
            state.subredditsHasError = false;
            action.payload.subreddits.forEach(subreddit => {
                state.page.subreddits = [...state.page.subreddits, subreddit.data]
            });
            state.contentReady = false;
        },
        [fetchSubreddits.rejected]: (state) => {
            state.subredditsAreLoading = false;
            state.subredditsHasError = true;
            state.contentReady = false;
        }
    }
});

export const { getInitialState: mainInitialState }  = mainSlice;

export const { setArticle, clearState: clearMainPageState, showNewPost, showNewComment } = mainSlice.actions;

export const selectMain = state => state.main;

export default mainSlice.reducer;