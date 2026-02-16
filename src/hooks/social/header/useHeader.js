import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Hooks & Services
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.services';
import { userService } from '@services/api/user/user.service';
import { ProfileUtils } from '@services/utils/profile-utils.services';
import { socketService } from '@services/socket/socket.service';
import { ROUTES } from '@root/constants';
import {
  getUserNotifications,
  markNotificationAsRead,
} from '@redux/api/notifications';

// ✅ Export the logout function separately
export const onLogout = async (navigate, dispatch, deleteStorageEmail, setLoggedIn) => {
  try {
    setLoggedIn(false);
    Utils.clearStore({ dispatch, deleteStorageEmail, setLoggedIn });
    await userService.logoutUser();
    socketService.disconnect();
    navigate(ROUTES.AUTH);
  } catch (error) {
    console.error(error);
    navigate(ROUTES.AUTH);
  }
};

const useHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.user);
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );

  // 1. Refs for Dropdowns
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);

  // 2. States (Using Custom Hook logic)
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
    settingsRef,
    false
  );

  // 3. LocalStorage Helpers
  const [deleteStorageEmail] = useLocalStorage('email', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');

  // 4. Environment Logic
  const environment = Utils.appEnvironment();
  const envColor =
    environment === 'DEV' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : '';

  // 5. Fetch Notifications on Mount
  useEffect(() => {
    dispatch(getUserNotifications());
  }, [dispatch]);

  // 6. (Derived States)
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // 7. Actions Handlers
  const onMarkAsRead = async (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  // 8. Actions (Business Logic)
  // (Exclusive Toggle)
  const toggleDropdown = (type) => {
    if (type === 'notification') {
      setIsNotificationActive((prev) => !prev);
      setIsMessageActive(false);
      setIsSettingsActive(false);
    } else if (type === 'messages') {
      setIsMessageActive((prev) => !prev);
      setIsNotificationActive(false);
      setIsSettingsActive(false);
    } else if (type === 'settings') {
      setIsSettingsActive((prev) => !prev);
      setIsNotificationActive(false);
      setIsMessageActive(false);
    }
  };

  const handleLogout = () => {
    onLogout(navigate, dispatch, deleteStorageEmail, setLoggedIn);
  };

  const onNavigateToProfile = () => {
    ProfileUtils.navigateToProfile(profile, navigate);
    setIsSettingsActive(false);
  };

  const onNavigateHome = () => {
    navigate(ROUTES.SOCIAL_STREAMS);
  };

  // 6. Return Data
  return {
    profile,
    isLoading,
    notifications,
    unreadNotificationCount,
    environment,
    envColor,
    dropdownState: { isNotificationActive, isMessageActive, isSettingsActive },
    refs: { notificationRef, messageRef, settingsRef },
    actions: { toggleDropdown, onLogout: handleLogout, onNavigateToProfile, onNavigateHome, onMarkAsRead },
  };
};

export default useHeader;
