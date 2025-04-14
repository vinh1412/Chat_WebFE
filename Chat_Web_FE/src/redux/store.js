import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slice/chatSlice";
import commonSlice from "./slice/commonSlice";
import friendSlice from "./friendSlice";

const store = configureStore({
    reducer: {
        chat: chatSlice,
        common: commonSlice,
        friend: friendSlice,
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware({
          serializableCheck:false
          
    })
});

export default store;