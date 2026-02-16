import { updateNotificationSettings } from '@redux/api/user';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@pages/social/settings/notification-settings/NotificationSettings.scss';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  const [settings, setSettings] = useState({
    messages: true,
    reactions: true,
    comments: true,
    follows: true,
  });

  useEffect(() => {
    if (profile?.notifications) {
      setSettings(profile.notifications);
    }
  }, [profile]);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    dispatch(updateNotificationSettings(newSettings));
  };

  return (
    <div className="settings-tab-content">
      <h3>Notification Settings</h3>
      <p className="description">Choose what you want to be notified about.</p>

      <div className="notification-list">
        {/* 1. Comments */}
        <div className="notification-item">
          <div className="text">
            <h4>Comments</h4>
            <span>Notify me when someone comments on my posts</span>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="comments"
              checked={settings.comments}
              onChange={() => handleToggle('comments')}
            />
            <label htmlFor="comments"></label>
          </div>
        </div>

        {/* 2. Reactions */}
        <div className="notification-item">
          <div className="text">
            <h4>Reactions</h4>
            <span>Notify me when someone reacts to my posts</span>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="reactions"
              checked={settings.reactions}
              onChange={() => handleToggle('reactions')}
            />
            <label htmlFor="reactions"></label>
          </div>
        </div>

        {/* 3. Follows */}
        <div className="notification-item">
          <div className="text">
            <h4>Follows</h4>
            <span>Notify me when someone follows me</span>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="follows"
              checked={settings.follows}
              onChange={() => handleToggle('follows')}
            />
            <label htmlFor="follows"></label>
          </div>
        </div>

        {/* 4. Messages */}
        <div className="notification-item">
          <div className="text">
            <h4>Direct Messages</h4>
            <span>Notify me when I receive a private message</span>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="messages"
              checked={settings.messages}
              onChange={() => handleToggle('messages')}
            />
            <label htmlFor="messages"></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
