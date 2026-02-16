import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaCheckDouble, FaBellSlash } from 'react-icons/fa';
import NotificationPreview from '@components/NotificationPreview/NotificationPreview';
import {
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@redux/api/notifications';
import '@pages/social/notifications/Notifications.scss';
import { notificationTypes } from '@root/constants/static-data';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );

  // Local State for Filtering
  const [filter, setFilter] = useState('All');
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  // 1. Filtering Logic (Client-side)
  useEffect(() => {
    let result = [];

    switch (filter) {
      case 'Unread':
        result = notifications.filter((n) => !n.read);
        break;
      case 'Comments':
        result = notifications.filter(
          (n) => n.notificationType === notificationTypes.COMMENT
        );
        break;
      default: // 'All'
        result = notifications;
    }

    setFilteredNotifications(result);
  }, [notifications, filter]);

  // 2. Actions Handlers
  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const onMarkAsRead = async (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  return (
    <div className="notifications-page-container">
      {/* --- Header Section --- */}
      <div className="notifications-header">
        <h2 className="title">Notifications</h2>
        {notifications.length > 0 && (
          <button className="mark-read-btn" onClick={handleMarkAllRead}>
            <FaCheckDouble /> Mark all as read
          </button>
        )}
      </div>

      {/* --- Tabs Section --- */}
      <div className="notifications-tabs">
        {['All', 'Unread', 'Comments'].map((tab) => (
          <button
            key={tab}
            className={`tab-item ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Content List --- */}
      <div className="notifications-list">
        {isLoading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationPreview
              key={notification._id}
              notification={notification}
              isDropdown={false}
              onMarkAsRead={() => onMarkAsRead(notification)}
            >
              {/* Children */}
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, notification._id)}
                title="Delete Notification"
              >
                <FaTrash />
              </button>
            </NotificationPreview>
          ))
        ) : (
          /* --- Empty State --- */
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <FaBellSlash className="empty-icon" />
            </div>
            <h3>No notifications here</h3>
            <p>
              {filter === 'All'
                ? "It seems you're all caught up! Check back later."
                : `You have no ${filter.toLowerCase()} notifications.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
