import axiosService from '@services/axios';

class AuthService {
  async signUp(body) {
    const response = await axiosService.post('/signup', body);
    return response;
  }

  async signIn(body) {
    const response = await axiosService.post('/signin', body);
    return response;
  }

  async verifyEmail(email, otp) {
    const response = await axiosService.post('/verify-email', { email, otp });
    return response;
  }

  async resendOTP() {
    const response = await axiosService.post('/resend-otp', {});
    return response;
  }

  async forgotPassword(email) {
    return await axiosService.post('/forgot-password', { email });
  }

  async verifyOTP(email, otp) {
    return await axiosService.post('/verify-otp', { email, otp });
  }

  async resetPassword(password, confirmPassword, resetToken) {
    return await axiosService.post('/reset-password', {
      password,
      confirmPassword,
      resetToken,
    });
  }
}

export const authService = new AuthService();
