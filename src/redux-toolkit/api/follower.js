import { createAsyncThunk } from "@reduxjs/toolkit";
import { followerService } from "@services/api/followers/follower.service";

// 1. Get Following List
export const getUserFollowing = createAsyncThunk(
  'followers/getFollowing',
  async ({userId, page}, { rejectWithValue }) => {
    try {
      const response = await followerService.getUserFollowing(userId, page);
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 2. Follow User
export const followUser = createAsyncThunk(
  'followers/follow',
  async (followeeId, { rejectWithValue }) => {
    try {
      const response = await followerService.followUser(followeeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 3. Unfollow User
export const unfollowUser = createAsyncThunk(
  'followers/unfollow',
  async (followeeId, { rejectWithValue }) => {
    try {
      await followerService.unfollowUser(followeeId);
      return followeeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 4. Get Followers
export const getUserFollowers = createAsyncThunk(
  'user/getFollowers',
  async ({userId, page}, { rejectWithValue }) => {
    try {
      const response = await followerService.getUserFollowers(userId, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 5. Get Blocked
export const getBlockedUsers = createAsyncThunk(
  'user/getBlocked',
  async ({page}, { rejectWithValue }) => {
    try {
      const response = await followerService.getBlockedUsers(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 6. Block User
export const blockUser = createAsyncThunk(
  'user/block',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await followerService.blockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 7. Unblock User
export const unblockUser = createAsyncThunk(
  'user/unblock',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await followerService.unblockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
