import { blockUser, followUser, getBlockedUsers, getUserFollowers, getUserFollowing, unblockUser, unfollowUser } from '@redux/api/follower';
import { createSlice } from '@reduxjs/toolkit';
import { ToastUtils } from '@services/utils/toast-utils.service';

const initialState = {
  following: [],
  followers: [],
  blocked: [],
  totalFollowing: 0,
  totalFollowers: 0,
  totalBlocked: 0,
  isLoading: false,
};

const followerSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Get Following ---
      .addCase(getUserFollowing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload.following;
        state.totalFollowing = action.payload.totalFollowing;
      })
      .addCase(getUserFollowing.rejected, (state) => {
        state.isLoading = false;
      })

      // --- Get Followers ---
      .addCase(getUserFollowers.pending, (state) => { state.isLoading = true; })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload.followers;
        state.totalFollowers = action.payload.totalFollowers;
      })
      .addCase(getUserFollowers.rejected, (state) => { state.isLoading = false; })

      // --- Get Blocked ---
      .addCase(getBlockedUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blocked = action.payload.blockedUsers;
        state.totalBlocked = action.payload.total;
      })
      .addCase(getBlockedUsers.rejected, (state) => { state.isLoading = false; })

      // --- Follow ---
      .addCase(followUser.fulfilled, (state, action) => {
        const newFollower = action.payload.follower;
        state.following = [...state.following, newFollower];
        state.totalFollowing += 1;
        ToastUtils.success('Following user');
      })
      .addCase(followUser.rejected, (state, action) => {
        ToastUtils.error(action.payload || 'Error following user');
      })

      // --- Unfollow ---
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.totalFollowing -= 1;
        state.following = state.following.filter(
          (item) => item._id !== action.payload
        );
        ToastUtils.success('Unfollowed user');
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        ToastUtils.error(action.payload || 'Error unfollowing user');
      })

      // Block
      .addCase(blockUser.fulfilled, (state, action) => {
        state.totalBlocked += 1;
        const { userId: blockedId } = action.payload;
        state.following = state.following.filter((u) => u._id !== blockedId);
        state.followers = state.followers.filter((u) => u._id !== blockedId);
        ToastUtils.success('User blocked');
      })

      // Unblock
      .addCase(unblockUser.fulfilled, (state, action) => {
        const { userId: blockedId } = action.payload;
        state.blocked = state.blocked.filter((u) => u._id !== blockedId);
        ToastUtils.success('User unblocked');
      });
  },
});

export default followerSlice.reducer;
