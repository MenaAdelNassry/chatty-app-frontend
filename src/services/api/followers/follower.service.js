import axiosService from '@services/axios';

class FollowerService {
  async getUserFollowing(userId, page=1, limit=12) {
    const response = await axiosService.get(`/user/following/${userId}?page=${page}&limit=${limit}`);
    return response;
  }

  async followUser(followerId) {
    const response = await axiosService.put(`/user/follow/${followerId}`);
    return response;
  }

  async unfollowUser(followeeId) {
    const response = await axiosService.delete(`/user/unfollow/${followeeId}`);
    return response;
  }

  async getBlockedUsers(page=1, limit=12) {
    const response = await axiosService.get(`/user/blocked?page=${page}&limit=${limit}`);
    return response;
  }

  async blockUser(blockedUserId) {
    const response = await axiosService.put(`/user/block/${blockedUserId}`);
    return response;
  }

  async unblockUser(blockedUserId) {
    const response = await axiosService.put(`/user/unblock/${blockedUserId}`);
    return response;
  }

  async getUserFollowers(userId, page=1, limit=12) {
    const response = await axiosService.get(`/user/followers/${userId}?page=${page}&limit=${limit}`);
    return response;
  }
}

export const followerService = new FollowerService();
