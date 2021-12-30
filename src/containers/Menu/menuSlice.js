import { createSlice } from '@reduxjs/toolkit';

export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menuOpen: false
    },
    reducers: {
        toggleMenu: (state, action) => {
            if (state.menuOpen) {
                state.menuOpen = false;
            } else {
                state.menuOpen = true;
            }
        },
        closeMenu: (state, action) => {
            if (state.menuOpen) {
                state.menuOpen = false;
            }
        }
    }
});

export const { toggleMenu, closeMenu } = menuSlice.actions;

export const selectMenu = state => {
    return state.menu;
}

export default menuSlice.reducer;
