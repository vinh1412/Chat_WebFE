import { createSlice } from "@reduxjs/toolkit";

const conmmonSlice = createSlice({
    name: "conmmon",
    initialState: {
        showConversation: false,
        showSearch: false,
    },
    reducers: {
        setShowConversation: (state, action) => ({
            ...state,
            showConversation: action.payload,
        }),
        setShowSearch: (state, action) => ({
            ...state,
            showSearch: action.payload,
        }),
    }
});

export const { setShowConversation, setShowSearch } = conmmonSlice.actions;
export default conmmonSlice.reducer;