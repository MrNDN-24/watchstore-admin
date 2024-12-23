import { createAxiosInstance } from '../config/axiosConfig';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = createAxiosInstance(`${API_BASE_URL}/styles`);

// export const getStyles = async (page, limit) => {
//   try {
//     // Nếu không có giá trị cho page hoặc limit, không phân trang
//     const url = page && limit ? `/?page=${page}&limit=${limit}` : '/';
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi lấy style:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export const getStyles = async (page, limit, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search); // Include search query

    const response = await axiosInstance.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching styles:", error);
    throw error;
  }
};


// Thêm mới style
export const createStyle = async (styleData) => {
  try {
    const response = await axiosInstance.post('/', styleData); // Gửi yêu cầu POST
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm style:', error);
    throw error;
  }
};

// Cập nhật style
export const updateStyle = async (styleId, styleData) => {
  try {
    const response = await axiosInstance.put(`/${styleId}`, styleData); // Gửi yêu cầu PUT
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật style với ID ${styleId}:`, error);
    throw error;
  }
};

// Xóa style
export const deleteStyle = async (styleId) => {
  try {
    const response = await axiosInstance.delete(`/${styleId}`); 
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa style với ID ${styleId}:`, error);
    throw error;
  }
};

// Cập nhật trạng thái isActive của style
export const updateStyleStatus = async (styleId, isActive) => {
  try {
    const response = await axiosInstance.put(`/status/${styleId}`, { isActive }); 
    return response.data;
  } catch (error) {
    console.error("Error updating style active status:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    throw error;
  }
};
