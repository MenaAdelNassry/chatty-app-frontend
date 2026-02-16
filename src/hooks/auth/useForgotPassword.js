import { useState } from 'react';
import { authService } from '@services/api/auth/auth.service';
import { ToastUtils } from '@services/utils/toast-utils.service';

const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  // 1. Send OTP
  const sendOTP = async (email) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      ToastUtils.success(response.data.message);
      return true; // Success Flag
    } catch (error) {
      ToastUtils.error(error.response?.data?.message || 'Error sending OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP
  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(email, otp);
      setResetToken(response.data.resetToken); // 🔥 Save Token in Memory
      ToastUtils.success(response.data.message);
      return true;
    } catch (error) {
      ToastUtils.error(error.response?.data?.message || 'Invalid OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Reset Password
  const resetPassword = async (password, confirmPassword) => {
    setIsLoading(true);
    try {
      if (!resetToken) throw new Error('Session expired');
      const response = await authService.resetPassword(password, confirmPassword, resetToken);
      ToastUtils.success(response.data.message);
      return true;
    } catch (error) {
      ToastUtils.error(error.response?.data?.message || 'Error resetting password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sendOTP, verifyOTP, resetPassword };
};

export default useForgotPassword;
