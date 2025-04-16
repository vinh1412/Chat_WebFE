import { createSlice } from "@reduxjs/toolkit";

const conmmonSlice = createSlice({
  name: "common",
  initialState: {
    showConversation: false,
    showSearch: false,
    selectedConversationId: null,
  },
  reducers: {
    setShowConversation: (state, action) => ({
      ...state,
      showConversation: action.payload,
    }),
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload; // Directly update the property
    },
    setShowSearch: (state, action) => ({
      ...state,
      showSearch: action.payload,
    }),
  },
});

export const { setShowConversation, setShowSearch, setSelectedConversationId } =
  conmmonSlice.actions;
export default conmmonSlice.reducer;
