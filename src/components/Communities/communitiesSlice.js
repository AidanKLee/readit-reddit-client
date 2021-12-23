import { createSlice } from '@reduxjs/toolkit';

export const communitiesSlice = createSlice({
    name: 'communities',
    initialState: {
        search: '',
    },
    reducers: {
        search: (state, action) => {
            state.search = action.payload;
        }
    }
});

export const { search } = communitiesSlice.actions;

export const selectCommunities = state => {
    return state.communities;
};

export default communitiesSlice.reducer;