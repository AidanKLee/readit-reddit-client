import { createSlice } from "@reduxjs/toolkit";

export const fullscreenSlice = createSlice({
    name: 'fullscreen',
    initialState: false,
    reducers: {
        toggleFullscreen: (state, action) => {
            console.log(action.payload)
            if (typeof action.payload !== 'boolean') {
                return !state
            } else {
                return action.payload
            }
        }
    }
});

export const { toggleFullscreen } = fullscreenSlice.actions;

export const selectFullscreen = (state) => state.fullscreen;

export default fullscreenSlice.reducer;