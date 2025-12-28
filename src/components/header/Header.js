import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegEnvelope,
} from 'react-icons/fa';

// Assets & Styles
import logo from '@assets/images/logo.svg';
import '@components/header/Header.scss';

// Components
import Avatar from '@components/avatar/Avatar';
import Dropdown from '@components/dropdown/Dropdown';
import MessageSidebar from '@components/message-sidebar/MessageSidebar';
import HeaderSkeleton from '@components/header/HeaderSkeleton';

// Hooks & Services
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.services';
import { userService } from '@services/api/user/user.service';
import { ProfileUtils } from '@services/utils/profile-utils.services';
import { ROUTES } from '@root/constants';
import { settingsItems } from '@root/constants';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  const isLoading = !profile;

  // 1. Environment Logic (Simple & Direct)
  const environment = Utils.appEnvironment();
  const backgroundColor =
    environment === 'DEV' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : '';

  // 2. Refs for Outside Click
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);

  // 3. States
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

  // Storage Helpers
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');

  // ***** Methods *****
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

  const onLogout = async () => {
    try {
      Utils.clearStore({ dispatch, deleteStorageUsername, setLoggedIn });
      await userService.logoutUser();
      navigate(ROUTES.AUTH);
    } catch (err) {
      console.error(err);
    }
  };

  const onNavigateToProfile = () => {
    ProfileUtils.navigateToProfile(profile, navigate);
    setIsSettingsActive(false);
  };

  return (
    <>
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          <div className="header-navbar">
            {/* Logo Section */}
            <div
              className="header-image"
              data-testid="header-image"
              onClick={() => navigate(ROUTES.SOCIAL_STREAMS)}
            >
              <img src={logo} alt="Chatty Logo" className="img-fluid" />
              <div className="app-name">
                Chatty
                {environment && (
                  <span className="environment" style={{ backgroundColor }}>
                    {environment}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Toggle (UI Only for now) */}
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>

            {/* Navigation Items */}
            <ul className="header-nav">
              {/* --- A. Notifications Icon --- */}
              <li className="header-nav-item active-item" ref={notificationRef}>
                <span
                  className="header-list-name"
                  onClick={() => toggleDropdown('notification')}
                >
                  <FaRegBell className="header-list-icon" />
                  <span
                    className="bg-danger-dots dots"
                    data-testid="notification-dots"
                  ></span>
                </span>

                {isNotificationActive && (
                  <ul className="dropdown-ul">
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '250px', top: '20px' }}
                        title="Notifications"
                        subTitle={0} // Notifications Count
                      >
                        <p className="empty-message">No notifications</p>
                        {/* هنا مستقبلاً هنحط NotificationItem زي ما عملنا في Playground */}
                      </Dropdown>
                    </li>
                  </ul>
                )}
              </li>

              {/* --- B. Messages Icon --- */}
              <li className="header-nav-item active-item" ref={messageRef}>
                <span
                  className="header-list-name"
                  onClick={() => toggleDropdown('messages')}
                >
                  <FaRegEnvelope className="header-list-icon" />
                  <span
                    className="bg-danger-dots dots"
                    data-testid="messages-dots"
                  ></span>
                </span>
                {/* Message Sidebar */}
                {isMessageActive && (
                  <div>
                    <MessageSidebar
                      profile={profile}
                      messageCount={0}
                      messageNotifications={[]}
                      openChatPage={() => {}}
                    />
                  </div>
                )}
              </li>

              {/* --- C. Settings / Profile --- */}
              <li className="header-nav-item" ref={settingsRef}>
                <span
                  className="header-list-name profile-image"
                  onClick={() => toggleDropdown('settings')}
                >
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span
                  className="header-list-name profile-name"
                  onClick={() => toggleDropdown('settings')}
                >
                  {profile?.username}
                  {isSettingsActive ? (
                    <FaCaretUp className="header-list-icon caret" />
                  ) : (
                    <FaCaretDown className="header-list-icon caret" />
                  )}
                </span>

                {isSettingsActive && (
                  <ul className="dropdown-ul">
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '150px', top: '40px' }}
                        title="Settings"
                      >
                        {settingsItems.map((item, i) => (
                          <div
                            key={item.id}
                            className="social-sub-card"
                            onClick={
                              item.id === 'logout'
                                ? onLogout
                                : onNavigateToProfile
                            }
                            style={{ marginTop: i === 0 ? "10px" : "" }}
                          >
                            <div className="content-avatar">{item.icon}</div>
                            <div className="content-body">
                              <h6 className="title">{item.title}</h6>
                              <p className="subtext">{item.subTitle}</p>
                            </div>
                          </div>
                        ))}
                      </Dropdown>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* 1. Main Navbar */}
    </>
  );
};

export default Header;
