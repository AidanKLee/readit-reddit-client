import { createSlice } from "@reduxjs/toolkit";

export const newPostSlice = createSlice({
    name: 'newPost',
    initialState: {
        open: false,
        params: {
            // link, self, image, video, videogif
            kind: 'self',
            nsfw: false,
            spoiler: false,
            sr: '',
            text: '',
            title: '',
            url: ''
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
        handleChange: (state, action) => {
            const { key, value } = action;
            state.params[key] = value;
        },
        setPostType: (state, action) => {
            state.params.kind = action.payload;
        }
    }
});

export const { openNewPost, closeNewPost, toggleNewPost, handleChange, setPostType } = newPostSlice.actions;

export const selectNewPost = (state) => state.newPost;

export default newPostSlice.reducer;