import { createSlice } from "@reduxjs/toolkit";

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState: {
    recentSearches: [],
  },
  reducers: {
    addToRecentSearches: (state, action) => {
      const user = action.payload;
      // Xóa user nếu đã tồn tại trong danh sách
      const filtered = state.recentSearches.filter(
        (item) => item.id !== user.id
      );
      // Thêm user vào đầu danh sách và giới hạn 5 kết quả
      state.recentSearches = [user, ...filtered].slice(0, 5);
    },
  },
});

export const { addToRecentSearches } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
