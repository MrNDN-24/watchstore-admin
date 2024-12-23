import { createAxiosInstance } from '../config/axiosConfig';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/customers`);
// Lấy danh sách khách hàng
// export const getAllCustomers = async (page = 1, limit = 5) => {
//   try {
//     const response = await axiosInstance.get(`/?page=${page}&limit=${limit}`);
//     return response.data; // Trả về toàn bộ dữ liệu gồm customers, total, page, totalPages
//   } catch (error) {
//     console.error("Có lỗi khi lấy danh sách khách hàng:", error);
//     throw error;
//   }
// };
export const getAllCustomers = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};


// Cập nhật trạng thái khách hàng
export const updateCustomerStatus = async (customerId, isActive) => {
  try {
    const response = await axiosInstance.put(`/${customerId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi cập nhật trạng thái khách hàng:', error);
    throw error;
  }
};
// Xóa khách hàng (cập nhật isDelete thành true)
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axiosInstance.delete(`/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi xóa khách hàng:', error);
    throw error;
  }
};
export const getCustomerById = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/${customerId}`);
    return response.data.customer;
  } catch (error) {
    console.error('Có lỗi khi lấy thông tin khách hàng:', error);
    throw error;
  }
};