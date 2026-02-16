import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.services';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { deactivateAccount } from '@redux/api/user';
import { ROUTES } from '@root/constants';
import '@pages/social/settings/account-settings/AccountSettings.scss';

const AccountSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDeactivate = async () => {
    if (!isChecked || !password) return;

    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone immediately.')) {
        try {
            await dispatch(deactivateAccount({ password })).unwrap();

            ToastUtils.success('Account deactivated successfully');
            
            Utils.clearStore({dispatch});
            navigate(ROUTES.AUTH);
            window.location.reload();
        } catch (error) {
            ToastUtils.error(error.message || 'Error deactivating account');
        }
    }
  };

  return (
    <div className="settings-tab-content">
        <h3>Account Management</h3>

        <div className="account-warning-card">
            <div className="warning-icon">
                <FaExclamationTriangle />
            </div>
            <div className="warning-text">
                <h4>Deactivate Account</h4>
                <p>
                    Deactivating your account will disable your profile and remove your name and photo from most things you've shared.
                    Some information may still be visible to others, such as your name in their friends list and messages you sent.
                </p>
            </div>
        </div>

        {/* 5. Password Input Section */}
        <div className="password-confirmation-group">
            <label htmlFor="confirm-password">Please enter your password to confirm:</label>
            <div className="input-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    id="confirm-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>

        <div className="confirmation-section">
            <div className="checkbox-wrapper">
                <input
                    type="checkbox"
                    id="confirm-deactivate"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="confirm-deactivate">
                    I understand the consequences of deactivating my account.
                </label>
            </div>

            <button
                className={`btn-danger ${(!isChecked || !password) ? 'disabled' : ''}`}
                onClick={handleDeactivate}
                disabled={!isChecked || !password}
            >
                Deactivate My Account
            </button>
        </div>
    </div>
  );
};

export default AccountSettings;
