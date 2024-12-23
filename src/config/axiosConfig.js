import axios from 'axios';

export const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json', // Mặc định cho các yêu cầu JSON
    },
  });

  // Thêm middleware để tự động thêm token vào header
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn token vào header
    }

    // Kiểm tra xem có phải là FormData không
    if (config.data instanceof FormData) {
      // Nếu là FormData, không cần set 'Content-Type' vì axios sẽ tự động làm điều này
      delete config.headers['Content-Type'];
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return instance;
};
