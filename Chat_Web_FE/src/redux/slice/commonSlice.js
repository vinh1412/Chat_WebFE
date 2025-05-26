import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    showConversation: false,
    showSearch: false,
    selectedConversation: null,
    searchResults: [],
    currentUser: null, 
    members: [],
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
    setSearchResults: (state, action) => {
      state.searchResults = action.payload; 
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload; 
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const { setShowConversation, setShowSearch, setSelectedConversation, setSearchResults, setCurrentUser, setMembers } =
  commonSlice.actions;
export default commonSlice.reducer;
