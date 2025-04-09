import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slice/chatSlice";
import commonSlice from "./slice/commonSlice";

const store = configureStore({
    reducer: {
        chat: chatSlice,
        common: commonSlice,
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
          serializableCheck:false
    })
});

export default store;