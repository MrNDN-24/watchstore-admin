import { createAxiosInstance } from '../config/axiosConfig';



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/auth`);
// Đăng nhập admin
export const loginAdmin = async (userData) => {
  try {
    console.log('Dữ liệu gửi từ client:', userData);  // Kiểm tra dữ liệu đầu vào
    const response = await axiosInstance.post('/adminLogin', userData);  // Gửi yêu cầu POST đến API
    console.log('Toàn bộ phản hồi từ server:', response);  // Kiểm tra phản hồi từ server
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập admin:', error.response ? error.response.data : error.message);
    throw error;
  }
};
// Quên mật khẩu
export const forgotpasswordAdmin = async (email) => {
  try {
    const response = await axiosInstance.post('/forgotpasswordAdmin', { email });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi quên mật khẩu:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const resetPasswordAdmin = async (id, token, newPassword) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/reset_passwordAdmin/${id}/${token}`, {
      method: 'POST', // Phương thức POST
      headers: {
        'Content-Type': 'application/json', // Dữ liệu gửi đi là JSON
      },
      body: JSON.stringify({ password: newPassword }), // Body gửi mật khẩu mới
    });

    if (!response.ok) {
      // Nếu server trả lỗi (HTTP status >= 400)
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password.');
    }

    const data = await response.json();
    console.log('Password reset successful:', data);
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};