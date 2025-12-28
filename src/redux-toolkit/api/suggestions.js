import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@services/api/user/user.service";

export const getUserSuggestions = createAsyncThunk('user/getSuggestions', async (_ ,thunkAPI) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
  }
});
