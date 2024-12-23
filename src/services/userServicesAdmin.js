import { createAxiosInstance } from '../config/axiosConfig';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/users`);

// export const getAllUsers = async (page = 1, limit = 5) => {
//   try {
//     const response = await axiosInstance.get(`/?page=${page}&limit=${limit}`); // Gửi yêu cầu GET với tham số phân trang
//     return response.data;
//   } catch (error) {
//     console.error('Có lỗi khi lấy danh sách người dùng:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };
export const getAllUsers = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


// Thêm người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/', userData);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi thêm người dùng:', error);
    throw error;
  }
};

// Sửa thông tin người dùng
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi sửa thông tin người dùng:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi xóa người dùng:', error);
    throw error;
  }
};
// Lấy thông tin người dùng theo id
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Cập nhật thông tin cá nhân của người dùng
export const updateUserById = async (userId, formData) => {
  try {
    const response = await axiosInstance.put(`/updateById/${userId}`, formData); 
    return response.data; 
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error; 
  }
};

// Cập nhật mật khẩu
export const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put(`/updatePassword/${userId}`, { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error; // Để catch được lỗi ở component React
  }
};
