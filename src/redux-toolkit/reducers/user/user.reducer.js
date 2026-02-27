import {
  addProfileImage,
  changePassword,
  getUserProfileByUserId,
  searchUsers,
  updateBasicInfo,
  updateNotificationSettings,
  updateSocialLinks,
} from '@redux/api/user';
import { createSlice } from '@reduxjs/toolkit';
import { ImageUtils } from '@services/utils/image.utils';
import { ToastUtils } from '@services/utils/toast-utils.service';

const initialState = {
  token: '',
  profile: null,
  selectedUserProfile: null,
  isLoading: false,
  isSidebarActive: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },
    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },
    updateUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    toggleSidebar: (state, action) => {
      state.isSidebarActive =
        action.payload !== undefined ? action.payload : !state.isSidebarActive;
    },
  },
  extraReducers: (builder) => {
    builder

      // Handle Add Profile Image
      .addCase(addProfileImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.type === 'profile') {
          state.profile.profilePicture = action.payload.url;
        } else {
          const { publicId, version } = ImageUtils.extractCloudinaryInfo(
            action.payload.url
          );
          state.profile.bgImageVersion = version;
          state.profile.bgImageId = publicId;
        }

        ToastUtils.success('Image updated successfully');
      })
      .addCase(addProfileImage.rejected, (state) => {
        state.isLoading = false;
        ToastUtils.error('Image cannot be updated. Try later.');
      })

      // 🔥 Handle getUserProfileByUserId
      .addCase(getUserProfileByUserId.pending, (state) => {
        state.isLoading = true;
        state.selectedUserProfile = null;
      })
      .addCase(getUserProfileByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUserProfile = action.payload.user;
      })
      .addCase(getUserProfileByUserId.rejected, (state) => {
        state.isLoading = false;
        state.selectedUserProfile = null;
      });

    // Basic Info
    builder.addCase(updateBasicInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateBasicInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = { ...state.profile, ...action.meta.arg };
      ToastUtils.success('Info updated successfully');
    });
    builder.addCase(updateBasicInfo.rejected, (state, action) => {
      state.isLoading = false;
      ToastUtils.error(action.payload);
    });

    // Social Links
    builder.addCase(updateSocialLinks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateSocialLinks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = { ...state.profile, social: action.meta.arg };
      ToastUtils.success('Social links updated');
    });
    builder.addCase(updateSocialLinks.rejected, (state, action) => {
      state.isLoading = false;
      ToastUtils.error(action.payload);
    });

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
      ToastUtils.success('Password changed successfully. Please login again.');
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      ToastUtils.error(action.payload);
    });

    // Change Notifications
    builder.addCase(updateNotificationSettings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateNotificationSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = { ...state.profile, notifications: action.meta.arg };
      ToastUtils.success('Settings updated successfully');
    });
    builder.addCase(updateNotificationSettings.rejected, (state, action) => {
      state.isLoading = false;
      ToastUtils.error(action.payload);
    });

    // Search Users
    builder.addCase(searchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(searchUsers.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { addUser, clearUser, updateUserProfile, toggleSidebar } = userSlice.actions;

export default userSlice.reducer;
