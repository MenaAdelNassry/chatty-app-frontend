import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '@services/api/notification/notification.service';

// 1. Fetch Notifications Thunk
export const getUserNotifications = createAsyncThunk(
  'notifications/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUserNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching notifications'
      );
    }
  }
);

// 2. Mark As Read Thunk (Optimistic)
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue({
        notificationId,
        message: error.response?.data?.message,
      });
    }
  }
);

// 3. Delete Notification Thunk (Optimistic)
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue({
        notificationId,
        message: error.response?.data?.message,
      });
    }
  }
);

// 4. Mark All Notifications As Read (Optimistic)
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllNotificationsAsRead();
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
