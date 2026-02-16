import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@redux/api/notifications';
import { createSlice } from '@reduxjs/toolkit';
import { ToastUtils } from '@services/utils/toast-utils.service';

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // 1. Insert
    addNotificationFromSocket: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      ToastUtils.info('You have a new notification! 🔔');
    },

    // 2. Update (Reaction Change)
    updateNotificationFromSocket: (state, action) => {
      const { notification } = action.payload;
      ToastUtils.info('You have a new notification! 🔔');

      state.notifications = state.notifications.filter(
        (n) => n._id.toString() !== notification._id.toString()
      );

      state.notifications.unshift(notification);
    },

    // 3. Delete (Block OR Undo)
    deleteNotificationFromSocket: (state, action) => {
      const { userFrom, notification } = action.payload;

      if (userFrom) {
        state.notifications = state.notifications.filter(
          (n) => n.userFrom._id.toString() !== userFrom.toString()
        );
      } else if (notification) {
        state.notifications = state.notifications.filter(
          (n) => n._id.toString() !== notification._id.toString()
        );
      }
    },

    // 4. Clear
    clearNotifications: (state) => {
      state.notifications = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Get Notifications Cases ---
      .addCase(getUserNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(getUserNotifications.rejected, (state) => {
        state.isLoading = false;
        ToastUtils.error('Failed to load notifications');
      })

      // --- Mark Read Cases (Optimistic Logic) ---
      .addCase(markNotificationAsRead.pending, (state, action) => {
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n._id === notificationId
        );
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        // unread (Rollback)
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n._id === notificationId
        );
        if (notification) {
          notification.read = false;
        }
        ToastUtils.error(
          action.payload?.message || 'Error updating notification'
        );
      })

      // --- Mark All As Read Cases (Optimistic Logic) ---
      .addCase(markAllNotificationsAsRead.pending, (state, action) => {
        state.notifications = state.notifications.map((n) => {
          n.read = true;
          return n;
        });
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        ToastUtils.error('Error updating notifications❌ Refresh Page And Try Again.');
      })

      // --- Delete Cases (Optimistic Logic) ---
      .addCase(deleteNotification.pending, (state, action) => {
        const notificationId = action.meta.arg;
        state.notifications = state.notifications.filter(
          (n) => n._id !== notificationId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        ToastUtils.error('Could not delete notification');
      });
  },
});

export const {
  addNotificationFromSocket,
  clearNotifications,
  updateNotificationFromSocket,
  deleteNotificationFromSocket,
} = notificationSlice.actions;
export default notificationSlice.reducer;
