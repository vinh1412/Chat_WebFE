import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slice/chatSlice";
import commonSlice from "./slice/commonSlice";
import friendSlice from "./friendSlice";
import searchHistorySlice from "./slice/searchHistorySlice";

const store = configureStore({
  reducer: {
    chat: chatSlice,
    common: commonSlice,
    friend: friendSlice,
    searchHistory: searchHistorySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
