import { createSlice } from '@reduxjs/toolkit';

export const communitiesSlice = createSlice({
    name: 'communities',
    initialState: {
        search: '',
        build: false,
    },
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
        },
        toggleBuild: (state) => {
            state.build = !state.build
        }
    }
});

export const { search, toggleBuild } = communitiesSlice.actions;

export const selectCommunities = state => {
    return state.communities;
};

export default communitiesSlice.reducer;