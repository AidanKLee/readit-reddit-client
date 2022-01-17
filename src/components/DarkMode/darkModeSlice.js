import { createSlice } from "@reduxjs/toolkit";

const time = new Date().getHours();

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        dayMode: time > 6 && time < 19 ? true : false,
        dayModeEnabled: localStorage.getItem('dayModeEnabled') ? localStorage.getItem('dayModeEnabled') === 'true' : true,
        darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode ? state.darkMode = false : state.darkMode = true;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
        toggleDayMode: (state) => {
            state.dayMode ? state.dayMode = false : state.dayMode = true;
        },
        setDayMode: (state, action) => {
            if (typeof(action.payload) === 'boolean') {
                state.dayMode = action.payload;
            }
        },
        toggleDayModeEnabled: (state) => {
            state.dayModeEnabled = !state.dayModeEnabled
        }
    }
})

export const { toggleDarkMode, setDarkMode, toggleDayMode, setDayMode, toggleDayModeEnabled } = darkModeSlice.actions;

export const selectDarkMode = state => {
    return state.darkMode;
}

export default darkModeSlice.reducer;