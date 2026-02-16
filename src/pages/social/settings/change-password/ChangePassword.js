import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastUtils } from '@services/utils/toast-utils.service';
import '@pages/social/settings/change-password/ChangePassword.scss';
import { changePassword } from '@redux/api/user';
import { Utils } from '@services/utils/utils.services';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggle Visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
        return ToastUtils.error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
        return ToastUtils.error('New passwords do not match');
    }

    try {
        await dispatch(changePassword({ currentPassword, newPassword, confirmPassword })).unwrap();

        Utils.clearStore({ dispatch, deleteSessionPageReload: false });

        setTimeout(() => {
            navigate('/');
        }, 1500);

        // Reset form on success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        // Error handled in reducer
    }
  };

  return (
    <div className="settings-tab-content">
        <h3>Change Password</h3>
        <p className="description">Ensure your account is using a long, random password to stay secure.</p>

        <form onSubmit={handleSubmit}>

            {/* 1. Current Password */}
            <div className="form-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                    <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                    />
                    <span className="eye-icon" onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>

            {/* 2. New Password */}
            <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                    <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
                        {showNew ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>

            {/* 3. Confirm Password */}
            <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
                    <input
                        type={showNew ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>

        </form>
    </div>
  );
};

export default ChangePassword;
