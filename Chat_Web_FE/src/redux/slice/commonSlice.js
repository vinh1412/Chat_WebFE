import { createSlice } from "@reduxjs/toolkit";

const conmmonSlice = createSlice({
  name: "common",
  initialState: {
    showConversation: false,
    showSearch: false,
    selectedConversation: null,
  },
  reducers: {
    setShowConversation: (state, action) => ({
      ...state,
      showConversation: action.payload,
    }),
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload; // Directly update the property
    },
    setShowSearch: (state, action) => ({
      ...state,
      showSearch: action.payload,
    }),
  },
});

export const { setShowConversation, setShowSearch, setSelectedConversation } =
  conmmonSlice.actions;
export default conmmonSlice.reducer;
