import axiosService from "@services/axios";

class NotificationService {
  async getUserNotifications() {
    const response = await axiosService.get("/notifications");
    return response;
  }

  async deleteNotification(notificationId) {
    const response = await axiosService.delete(`/notification/${notificationId}`);
    return response;
  }

  async markNotificationAsRead(notificationId) {
    const response = await axiosService.put(`/notification/${notificationId}`);
    return response;
  }

  async markAllNotificationsAsRead() {
    const response = await axiosService.put(`/notifications/mark-as-read`);
    return response;
}
}

export const notificationService = new NotificationService();
