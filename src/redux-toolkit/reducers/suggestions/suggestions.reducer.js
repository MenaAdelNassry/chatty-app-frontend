import { createSlice } from "@reduxjs/toolkit";
import { getUserSuggestions } from "@redux/api/suggestions";

const initialState = {
  users: [],
  isLoading: true,
  error: null
}

const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    addToSuggestions: (state, action) => {
      state.users = [...action.payload.users];
      state.isLoading = action.payload.isLoading;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSuggestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserSuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.users = [...action.payload.users];
      })
      .addCase(getUserSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { addToSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
