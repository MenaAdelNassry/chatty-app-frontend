import { ROUTES } from '@root/constants';
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_ENDPOINT}/api/v1`;

const axiosService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': "application/json", Accept: 'application/json' }
});

// if user manipulated in the front end
// the interceptor return it to Home Page
axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response && error.response.status === 401) {
      localStorage.removeItem('email');
      localStorage.removeItem('keepLoggedIn');

      window.location.href = ROUTES.AUTH;
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosService;
