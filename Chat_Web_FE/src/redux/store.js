import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slice/chatSlice";

const store = configureStore({
    reducer: {
        chat: chatSlice,
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
          serializableCheck:false
    })
});

export default store;