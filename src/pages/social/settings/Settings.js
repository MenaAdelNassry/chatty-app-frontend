import { useState } from 'react';
import { FaLock, FaBell, FaUserSlash } from 'react-icons/fa';
import '@pages/social/settings/Settings.scss';
import ChangePassword from './change-password/ChangePassword';
import NotificationSettings from './notification-settings/NotificationSettings';
import AccountSettings from './account-settings/AccountSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'notifications' | 'account'

  return (
    <div className="settings-page">
        <div className="settings-container">

            {/* --- Left Sidebar --- */}
            <div className="settings-sidebar">
                <h3>Settings</h3>
                <ul>
                    <li
                        className={activeTab === 'password' ? 'active' : ''}
                        onClick={() => setActiveTab('password')}
                    >
                        <FaLock className="icon" /> Change Password
                    </li>
                    <li
                        className={activeTab === 'notifications' ? 'active' : ''}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FaBell className="icon" /> Notifications
                    </li>
                    <li
                        className={activeTab === 'account' ? 'active' : ''}
                        onClick={() => setActiveTab('account')}
                    >
                        <FaUserSlash className="icon" /> Account Management
                    </li>
                </ul>
            </div>

            {/* --- Right Content --- */}
            <div className="settings-content">
                {activeTab === 'password' && <ChangePassword />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'account' && <AccountSettings />}
            </div>

        </div>
    </div>
  );
};

export default Settings;
