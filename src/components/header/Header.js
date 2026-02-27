import logo from '@assets/images/logo.svg';
import {
  FaBars,
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegBellSlash,
  FaRegEnvelope,
  FaSearch,
} from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import Dropdown from '@components/dropdown/Dropdown';
import MessageSidebar from '@components/message-sidebar/MessageSidebar';
import { ROUTES, settingsItems } from '@root/constants';
import useHeader from '@hooks/social/header/useHeader';
import '@components/header/Header.scss';
import DropdownItem from '@components/dropdown/DropdownItem';
import NotificationPreview from '@components/NotificationPreview/NotificationPreview';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '@hooks/useDebounce';
import { userService } from '@services/api/user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@redux/reducers/user/user.reducer';

const Header = () => {
  const {
    profile,
    environment,
    envColor,
    dropdownState,
    refs,
    actions,
    notifications,
    unreadNotificationCount,
  } = useHeader();

  const { isNotificationActive, isMessageActive, isSettingsActive } =
    dropdownState;
  const { notificationRef, messageRef, settingsRef } = refs;
  const {
    toggleDropdown,
    onLogout,
    onNavigateToProfile,
    onNavigateHome,
    onMarkAsRead,
  } = actions;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Search Logic Starts Here ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { conversations } = useSelector((state) => state.chat);
  const messageCount = conversations.reduce((sum, convo) => {
    const myUnread = convo.unreadCounts?.[profile?._id] || 0;
    return sum + myUnread;
  }, 0);
  const messageNotifications = conversations
    .filter((convo) => convo.lastMessage)
    .slice(0, 10);

  const openChatPage = (convo) => {
    toggleDropdown('messages');

    const otherParticipant = convo.participants.find(
      (p) => p._id !== profile?._id
    );
    const targetId = otherParticipant?._id;

    const url = `/app/social/chat/messages?id=${targetId}&cid=${convo._id}`;
    navigate(url);
  };

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null); // ريف للتحكم في الفوكس

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    // تأخير بسيط عشان نضمن إن الانبوت ظهر قبل ما نعمل فوكس
    if (!isMobileSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  useEffect(() => {
    const searchForUsers = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        try {
          const response = await userService.searchUsers(debouncedSearchTerm);
          setSearchResults(response.data.users);
          setShowSearchDropdown(true);
        } catch (error) {
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
        setIsSearching(false);
      }
    };

    searchForUsers();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsItemClick = (item) => {
    if (item.id === 'logout') {
      onLogout();
    } else if (item.id === 'profile') {
      onNavigateToProfile();
    } else if (item.id === 'settings') {
      toggleDropdown('settings');
      navigate('/app/social/settings');
    }
  };

  const onSearchSubmit = (e) => {
    if (e.key && e.key !== 'Enter') return;

    setShowSearchDropdown(false);
    navigate({
      pathname: ROUTES.SOCIAL_SEARCH,
      search: createSearchParams({ q: searchTerm }).toString(),
    });
  };

  const navigateToProfileResult = (id, username) => {
    navigate(`/app/social/profile/${username}/${id}`);
    setShowSearchDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="header-nav-wrapper" data-testid="header-wrapper">
      <div className="header-navbar">
        {/* 1. Logo Section */}
        <div
          className="header-image"
          data-testid="header-image"
          onClick={onNavigateHome}
        >
          <FaBars
            className="mobile-menu-icon"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleSidebar());
            }}
          />
          <img src={logo} alt="Chatty Logo" className="img-fluid" />
          <div className="app-name">
            Chatty
            {environment && (
              <span
                className="environment"
                style={{ backgroundColor: envColor }}
              >
                {environment}
              </span>
            )}
          </div>
        </div>

        {/* 2. Search Section */}
        {/* 🔥🔥 Search Section 🔥🔥 */}
        <div
          className={`header-search-wrapper ${
            isMobileSearchOpen ? 'open' : ''
          }`}
          ref={searchRef}
        >
          <div className="search-bar">
            <FaSearch className="search-icon" onClick={toggleMobileSearch} />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setIsMobileSearchOpen(false)}
            />
          </div>

          {/* Dropdown Results */}
          {showSearchDropdown && searchTerm && (
            <div className="search-dropdown">
              {isSearching ? (
                <div className="dropdown-loading">Searching...</div>
              ) : (
                <ul className="search-results-list">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((user) => (
                        <li
                          key={user._id}
                          onClick={() =>
                            navigateToProfileResult(user._id, user.username)
                          }
                        >
                          <Avatar
                            name={user.username}
                            bgColor={user.avatarColor}
                            textColor="#ffffff"
                            size={40}
                            avatarSrc={user.profilePicture}
                          />
                          <span className="username">{user.username}</span>
                        </li>
                      ))}
                      <li className="see-all-btn" onClick={onSearchSubmit}>
                        See all results for "{searchTerm}"
                      </li>
                    </>
                  ) : (
                    <div className="dropdown-empty">No people found</div>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* 3. Navigation Items */}
        {!isMobileSearchOpen && (
          <ul className="header-nav">
            {/* --- Notifications Icon --- */}
            <li className="header-nav-item active-item" ref={notificationRef}>
              <span
                className="header-list-name"
                onClick={() => toggleDropdown('notification')}
              >
                <FaRegBell className="header-list-icon" />
                {unreadNotificationCount > 0 && (
                  <span
                    className="bg-danger-dots"
                    data-testid="notification-dots"
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </span>

              {isNotificationActive && (
                <ul className="dropdown-ul">
                  <li className="dropdown-li">
                    <Dropdown
                      height={300}
                      style={{ right: '0' }} // SCSS handles relative positioning now
                      title="Notifications"
                      subTitle={unreadNotificationCount}
                    >
                      {notifications.length > 0 ? (
                        <div className="notifications-container">
                          {notifications.map((notification) => (
                            <NotificationPreview
                              key={notification._id}
                              notification={notification}
                              onMarkAsRead={() => onMarkAsRead(notification)}
                            />
                          ))}
                        </div>
                      ) : (
                        // Empty State Design
                        <div className="empty-state">
                          <FaRegBellSlash className="empty-icon" />
                          <p className="empty-message">
                            You have no notifications
                          </p>
                        </div>
                      )}
                    </Dropdown>
                  </li>
                </ul>
              )}
            </li>

            {/* --- Messages Icon --- */}
            <li className="header-nav-item active-item" ref={messageRef}>
              <span
                className="header-list-name"
                onClick={() => toggleDropdown('messages')}
              >
                <FaRegEnvelope className="header-list-icon" />
                {messageCount > 0 && (
                  <span className="bg-danger-dots" data-testid="messages-dots">
                    {messageCount}
                  </span>
                )}
              </span>

              {isMessageActive && (
                <div className="dropdown-ul">
                  <MessageSidebar
                    profile={profile}
                    messageCount={messageCount}
                    messageNotifications={messageNotifications}
                    openChatPage={openChatPage}
                  />
                </div>
              )}
            </li>

            {/* --- Settings / Profile --- */}
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
                  <FaCaretUp className="caret" />
                ) : (
                  <FaCaretDown className="caret" />
                )}
              </span>

              {isSettingsActive && (
                <ul className="dropdown-ul">
                  <li className="dropdown-li">
                    <Dropdown
                      title="Settings"
                      height={300}
                      style={{ right: '0' }}
                    >
                      {settingsItems.map((item) => (
                        <DropdownItem
                          key={item.id}
                          title={item.title}
                          subTitle={item.subTitle}
                          icon={item.icon}
                          onClick={() => handleSettingsItemClick(item)}
                        />
                      ))}
                    </Dropdown>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Header;
