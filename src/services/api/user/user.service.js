import axios from '@services/axios';

class UserService {
  async getUserSuggestions() {
    const response = await axios.get('/user/profile/suggestions');
    return response;
  }

  async logoutUser() {
    const response = await axios.get('/signout');
    return response;
  }

  async checkCurrentUser() {
    const response = await axios.get('/currentuser');
    return response;
  }

  async getUserProfileByUserId(userId) {
    const response = await axios.get(`/user/profile/${userId}`);
    return response;
  }

  async updateUserInfo(info) {
    const response = await axios.put('/user/profile/basic-info', info);
    return response;
  }

  async updateUserSocial(social) {
    const response = await axios.put('/user/profile/social-links', social);
    return response;
  }

  async changePassword(body) {
    const response = await axios.put('/user/profile/change-password', body);
    return response;
  }

  async updateNotificationSettings(settings) {
    const response = await axios.put('/user/profile/notifications', settings);
    return response;
  }

  async deactivateAccount(body) {
    const response = await axios.post('/user/deactivate', body);
    return response;
  }

  async searchUsers(query, page = 1) {
    const response = await axios.get(`/user/search/${query}/${page}`);
    return response;
  }
}

export const userService = new UserService();
