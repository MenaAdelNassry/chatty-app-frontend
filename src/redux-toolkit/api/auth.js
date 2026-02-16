import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@services/api/auth/auth.service";

// 1. Verify Email Thunk
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(email, otp);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 2. Resend OTP Thunk
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.resendOTP();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
