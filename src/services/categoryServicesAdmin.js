import { createAxiosInstance } from '../config/axiosConfig';

// Tạo instance cho các API liên quan đến danh mục

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/categories`);

// export const getCategories = async (page, limit) => {
//   try {
//     // Nếu không có giá trị cho page hoặc limit, không phân trang
//     const url = page && limit ? `/?page=${page}&limit=${limit}` : '/';
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching categories:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// };
export const getCategories = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Thêm mới danh mục
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/', categoryData); // Gửi yêu cầu POST để thêm danh mục
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/${categoryId}`, categoryData); // Gửi yêu cầu PUT để cập nhật danh mục
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${categoryId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Xóa danh mục
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/${categoryId}`); // Gửi yêu cầu DELETE để xóa danh mục
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${categoryId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Cập nhật trạng thái isActive của danh mục
export const updateCategoryStatus = async (categoryId, isActive) => {
  try {
    const response = await axiosInstance.put(`/status/${categoryId}`, { isActive }); // Gửi yêu cầu PUT để cập nhật trạng thái
    return response.data;  // Trả về dữ liệu của danh mục đã cập nhật
  } catch (error) {
    console.error("Error updating category active status:", error.response ? error.response.data : error.message);
    throw error;
  }
};
