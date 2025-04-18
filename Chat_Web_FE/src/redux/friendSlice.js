import { createSlice } from "@reduxjs/toolkit";
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        contactOption: 0,
        isSuccessSent: [],
    
    },
    reducers: {
        setContactOption: (state, action) => {
            state.contactOption = action.payload;
        },
        setIsSuccessSent: (state, action) => {
            console.log("action.payload: ", action.payload);
            if(!state.isSuccessSent[action.payload]) {
                state.isSuccessSent[action.payload] = [];
            }
            state.isSuccessSent[action.payload].push(true);
        },

    },
});
export const {
    setContactOption,
    setIsSuccessSent,
} = friendSlice.actions;
export default friendSlice.reducer;