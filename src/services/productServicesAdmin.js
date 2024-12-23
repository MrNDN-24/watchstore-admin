import { createAxiosInstance } from '../config/axiosConfig';

// Tạo instance cho các API liên quan đến sản phẩm

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/productAPI`);
// Tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/', productData); // Gửi yêu cầu POST để tạo sản phẩm
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Lấy tất cả sản phẩm
// export const getAllProducts = async (page = 1, limit = 4) => {
//   try {
//     const response = await axiosInstance.get('/', {
//       params: { page, limit }, 
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };
export const getAllProducts= async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search); // Append search term if provided

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


// Lấy sản phẩm theo ID
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/${productId}`); // Gửi yêu cầu GET để lấy sản phẩm theo ID
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProductActive = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/${productId}`, productData); // Gửi yêu cầu PUT để cập nhật sản phẩm
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/${productId}`); // Gửi yêu cầu DELETE để xóa sản phẩm
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};


// Cập nhật thông tin sản phẩm
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/update/${productId}`, productData); // Gửi yêu cầu PUT để cập nhật thông tin sản phẩm
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};