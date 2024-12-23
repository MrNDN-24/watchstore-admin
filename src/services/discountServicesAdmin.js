import { createAxiosInstance } from '../config/axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/discounts`);

// export const getDiscounts = async (page = 1, limit = 5) => {
//   try {
//     const response = await axiosInstance.get(`/?page=${page}&limit=${limit}`); // Gửi yêu cầu GET kèm tham số
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching discounts:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export const getDiscounts = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

export const createDiscount = async (discountData) => {
  try {
    const response = await axiosInstance.post('/create', discountData);
    return response.data;
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

export const updateDiscount = async (code, discountData) => {
  try {
    const response = await axiosInstance.put(`/${code}`, discountData);
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

export const deleteDiscount = async (code) => {
  try {
    const response = await axiosInstance.delete(`/${code}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

export const validateDiscountForUser = async (code, userId) => {
  try {
    const response = await axiosInstance.post(`/${code}/validate`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error validating discount for user:', error);
    throw error;
  }
};
