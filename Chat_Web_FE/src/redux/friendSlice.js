import { createSlice } from "@reduxjs/toolkit";
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        contactOption: 0,
    
    },
    reducers: {
        setContactOption: (state, action) => {
            state.contactOption = action.payload;
        },
    },
});
export const {
    setContactOption,
} = friendSlice.actions;
export default friendSlice.reducer;