import axios from '@services/axios';

class ImageService {
  async addImage(url, data) {
    const response = await axios.post(url, data);
    return response;
  }

  async removeImage(imageId) {
    const response = await axios.delete(`/images/${imageId}`);
    return response;
  }

  async getImages(userId, page = 1, type = 'profile') {
    // type: 'profile' | 'background'
    const response = await axios.get(`/images/${userId}/${page}/${type}`);
    return response;
}
}

export const imageService = new ImageService();
