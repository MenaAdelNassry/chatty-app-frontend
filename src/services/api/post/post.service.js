import axiosService from '@services/axios';

class PostService {
  async createPost(body) {
    const response = await axiosService.post('/post', body);
    return response;
  }

  async createPostWithImage(body) {
    const response = await axiosService.post('/post/image/post', body);
    return response;
  }

  async createPostWithVideo(body) {
    const response = await axiosService.post('/post/video/post', body);
    return response;
  }

  async getAllPosts(page) {
    const response = await axiosService.get(`/post/all/${page}`);
    return response;
  }

  async getPostsWithImages(page) {
    const response = await axiosService.get(`/post/images/${page}`);
    return response;
  }

  async getPostsWithVideos(page) {
    const response = await axiosService.get(`/post/videos/${page}`);
    return response;
}

  async addReaction(body) {
    const response = await axiosService.post('/post/reaction', body);
    return response;
  }

  async removeReaction(postId) {
    const response = await axiosService.delete(`/post/reaction/${postId}`);
    return response;
  }

  async getPostReactions(postId) {
    const response = await axiosService.get(`/post/reactions/${postId}`);
    return response;
  }

  async getPostComments(postId) {
    const response = await axiosService.get(`/post/comments/${postId}`);
    return response;
  }

  async addComment(body) {
    const response = await axiosService.post('/post/comment', body);
    return response;
  }

  async deleteComment(postId, commentId) {
    const response = await axiosService.delete(`/post/comment/${postId}/${commentId}`);
    return response;
  }

  async updatePost(postId, body) {
    // body: { post, bgColor, privacy, feelings, image, video, gifUrl, imgVersion, imgId... }
    const response = await axiosService.put(`/post/${postId}`, body);
    return response;
  }

  async deletePost(postId) {
    const response = await axiosService.delete(`/post/${postId}`);
    return response;
  }

  // 🔥 Get Posts by User ID (Profile Timeline)
  async getPostsByUserId(userId, page) {
    const response = await axiosService.get(`/post/user/${userId}/${page}`);
    return response;
  }

  async getPostById(postId) {
    const response = await axiosService.get(`/post/${postId}`);
    return response;
  }
}

export const postService = new PostService();
