import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@redux/reducers/user/user.reducer"
import suggestionSlice from "@redux/reducers/suggestions/suggestions.reducer"

export const store = configureStore({
  reducer: {
    user: userSlice,
    suggestions: suggestionSlice
  }
});

