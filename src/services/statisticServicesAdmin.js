import { createAxiosInstance } from '../config/axiosConfig';

// Tạo instance cho các API liên quan đến sản phẩm

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/statistics`);

export const getStatistics = async () => {
  try {
    const response = await axiosInstance.get('/'); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error; 
  }
};
export const getTopProducts = async () => {
  try {
    const response = await axiosInstance.get('/topProducts');
    console.log(response.data); // Log dữ liệu trả về từ API
    return response.data; 
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw error; 
  }
};
