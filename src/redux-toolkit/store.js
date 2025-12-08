import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@redux/reducers/user/user.reducer"

export const store = configureStore({
  reducer: {
    user: userSlice
  }
});

