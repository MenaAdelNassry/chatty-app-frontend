import axios from 'axios';

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const BASE_URL = 'https://api.giphy.com/v1/gifs';

export class GiphyUtils {
  static async getTrendingGifs() {
    const response = await axios.get(`${BASE_URL}/trending`, {
      params: { api_key: GIPHY_API_KEY, limit: 20 }
    });
    return response.data.data;
  }

  static async searchGifs(query) {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { api_key: GIPHY_API_KEY, q: query, limit: 20 }
    });
    return response.data.data;
  }
}
