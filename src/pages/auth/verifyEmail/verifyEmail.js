import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';

import OTPInput from '@components/otp-input/OTPInput';
import useTimer from '@hooks/auth/useTimer';
import { verifyEmail, resendOTP } from '@redux/api/auth';
import { updateUserProfile } from '@redux/reducers/user/user.reducer';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { OTP_TIMER, ROUTES } from '@root/constants';
import '@pages/auth/verifyEmail/verifyEmail.scss';
import { onLogout } from '@hooks/social/header/useHeader';
import useLocalStorage from '@hooks/useLocalStorage';

const VerifyEmail = () => {
  const [deleteStorageEmail] = useLocalStorage('email', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);

  // 1. Timer Hook
  const { timeRemaining, startTimer, formatTime } = useTimer(
    OTP_TIMER.RESEND_WAIT
  );

  // 2. (Security Check)
  useEffect(() => {
    if (!profile) {
      navigate(ROUTES.AUTH);
    }
    if (profile?.emailVerified) {
      navigate(ROUTES.SOCIAL_STREAMS);
    }
  }, [profile, navigate]);

  // 3. Start the timer as soon as the page opens.
  useEffect(() => {
    startTimer();
  }, []); // eslint-disable-line

  // --- Handlers ---

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      ToastUtils.error('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      // 1. Call API
      const resultAction = await dispatch(
        verifyEmail({ email: profile.email, otp: otpCode })
      );

      if (verifyEmail.fulfilled.match(resultAction)) {
        ToastUtils.success('Email verified successfully!');

        // 2. Update Redux State (Important!)
        const updatedProfile = { ...profile, emailVerified: true };
        dispatch(updateUserProfile(updatedProfile));

        // 3. Navigate Home
        navigate(ROUTES.SOCIAL_STREAMS);
      } else {
        ToastUtils.error(resultAction.payload || 'Verification failed');
      }
    } catch (error) {
      ToastUtils.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const resultAction = await dispatch(resendOTP());
      if (resendOTP.fulfilled.match(resultAction)) {
        ToastUtils.success('OTP resent successfully.');
        startTimer(); // Restart Timer
      } else {
        ToastUtils.error(resultAction.payload);
      }
    } catch (error) {
      ToastUtils.error('Error sending OTP');
    }
  };

  return (
    <div className="auth-inner">
      <div className="auth-box verify-email-box">
        <div className="header-icon">
          <FaEnvelopeOpenText />
        </div>
        <h2>Verify Your Email</h2>
        <p className="auth-subtitle">
          We sent a code to <strong>{profile?.email}</strong>.
          <br />
          Enter it below to unlock your account.
        </p>

        {/* --- OTP Component --- */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          autoFocus={true}
        />

        <div className="timer-info">
          Code expires in {OTP_TIMER.VERIFY_EMAIL / 60} minutes.
        </div>

        {/* --- Verify Button --- */}
        <button
          className="auth-btn btn-primary"
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* --- Resend Section --- */}
        <div className="resend-section">
          <p>Didn't receive code?</p>
          <button
            className="btn-link"
            onClick={handleResend}
            disabled={timeRemaining > 0}
          >
            {timeRemaining > 0 ? `Resend in ${formatTime()}` : 'Resend OTP'}
          </button>
        </div>

        {/* Logout Option (If the user wants to log in with a different email address) */}
        <div className="back-link">
          <a
            href={ROUTES.AUTH}
            onClick={(e) => {
              e.preventDefault();
              onLogout(navigate, dispatch, deleteStorageEmail, setLoggedIn);
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
