import { createAxiosInstance } from '../config/axiosConfig';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/orderAPI`);

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.put(`/${orderId}`, { deliveryStatus: status }); // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
    return response.data;
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/${orderId}`); // Assuming your API supports fetching order details by orderId
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const getOrders = async (status, dateFilter, page = 1, limit = 4) => {
  try {
    const params = {
      status,
      dateFilter,
      page,
      limit
    };

    const response = await axiosInstance.get('/', { params }); 
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
