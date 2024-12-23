import { createAxiosInstance } from '../config/axiosConfig';



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/images`);
// Thêm hình ảnh
export const addImage = async (data) => {
  try {
    const response = await axiosInstance.post('/add', data); // Gửi yêu cầu POST để thêm hình ảnh
    return response.data;
  } catch (error) {
    console.error("Error adding image:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Lấy tất cả hình ảnh của sản phẩm theo ID
export const fetchImages = async (productId) => {
  try {
    const response = await axiosInstance.get(`/${productId}`); // Gửi yêu cầu GET để lấy hình ảnh của sản phẩm theo ID
    return response.data;
  } catch (error) {
    console.error("Error fetching product images:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Xóa hình ảnh theo ID
export const deleteImage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`); // Gửi yêu cầu DELETE để xóa hình ảnh
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Cập nhật hình ảnh theo ID
export const updateImage = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/${id}`, data); // Gửi yêu cầu PUT để cập nhật hình ảnh
    return response.data;
  } catch (error) {
    console.error("Error updating image:", error.response ? error.response.data : error.message);
    throw error;
  }
};
