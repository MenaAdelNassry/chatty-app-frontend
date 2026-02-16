import { createAsyncThunk } from '@reduxjs/toolkit';
import { imageService } from '@services/api/image/image.service';
import { userService } from '@services/api/user/user.service';

export const addProfileImage = createAsyncThunk(
  'user/addProfileImage',
  async ({ url, data, type }, { rejectWithValue }) => {
    try {
      const response = await imageService.addImage(url, data);
      return { ...response.data, type };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserProfileByUserId = createAsyncThunk(
  'user/getUserProfileByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfileByUserId(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateBasicInfo = createAsyncThunk(
  'user/updateBasicInfo',
  async (info, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserInfo(info);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateSocialLinks = createAsyncThunk(
  'user/updateSocialLinks',
  async (social, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserSocial(social);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (body, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'user/updateNotificationSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await userService.updateNotificationSettings(settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deactivateAccount = createAsyncThunk(
  'user/deactivateAccount',
  async (body, { rejectWithValue }) => {
    try {
      const response = await userService.deactivateAccount(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
