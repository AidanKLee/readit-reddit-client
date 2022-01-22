import { createSlice } from "@reduxjs/toolkit";

export const clockSlice = createSlice({
    name: 'clock',
    initialState: {
        clock: {
            now: Date.now(),
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDay(),
            date: new Date().getDate(),
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        }
    },
    reducers: {
        updateTime: (state) => {
            state.clock = {
                now: Date.now(),
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDay(),
                date: new Date().getDate(),
                hour: new Date().getHours(),
                minutes: new Date().getMinutes(),
                seconds: new Date().getSeconds()
            }
        }
    }
})

export const { updateTime } = clockSlice.actions;

export const selectClock = (state) => state.clock.clock;

export default clockSlice.reducer;