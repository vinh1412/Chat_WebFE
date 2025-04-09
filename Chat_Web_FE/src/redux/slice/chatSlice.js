import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        currentTab: "Chat",
    },
    reducers: {
        setCurrentTab: (state, action) => {
            state.currentTab = action.payload;
        },
    }
});

export const { setCurrentTab } = chatSlice.actions;
export default chatSlice.reducer;