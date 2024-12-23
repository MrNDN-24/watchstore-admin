import { createAxiosInstance } from '../config/axiosConfig';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/brands`);



// export const fetchBrands = async (page, limit) => {
//   try {
//     // Nếu không có giá trị cho page hoặc limit, không phân trang
//     const url = page && limit ? `/?page=${page}&limit=${limit}` : '/';
//     const response = await axiosInstance.get(url);
//     return response.data; // Trả về dữ liệu gồm brands, total, page, totalPages nếu có phân trang
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     throw error;
//   }
// };
export const fetchBrands = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};



// Thêm thương hiệu
export const createBrand = async (formData) => {
  try {
    const response = await axiosInstance.post(`/add`, formData); 
    return response.data; 
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error; 
  }
};

// Cập nhật thương hiệu
export const updateBrand = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, formData); // Gửi yêu cầu PUT để cập nhật thương hiệu theo ID
    return response.data; // Trả về dữ liệu thương hiệu đã cập nhật
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Xóa thương hiệu
// export const deleteBrand = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/${id}`); // Gửi yêu cầu DELETE
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting brand:", error);
//     throw error;
//   }
// };
export const deleteBrand = async (id) => {
  try {
    const response = await  axiosInstance.delete(`/${id}`); // Gửi yêu cầu DELETE
    return response.data;
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi từ server (nếu có)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Lỗi không xác định");
    } else {
      throw new Error("Lỗi kết nối đến server");
    }
  }
};

// Cập nhật trạng thái hoạt động của thương hiệu
export const updateBrandActive = async (id, isActive) => {
  try {
    const response = await axiosInstance.put(`/updateActive/${id}`, { isActive });
    return response.data;
  } catch (error) {
    console.error("Error updating brand active status:", error);
    throw error;
  }
};
