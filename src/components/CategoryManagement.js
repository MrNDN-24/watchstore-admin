import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "../services/categoryServicesAdmin";
import Pagination from "../components/Pagination"; // Import Pagination
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import "../styles/CategoryManagement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Số lượng danh mục mỗi trang

  const [search, setSearch] = useState("");
  const fetchData = (page) => {
    getCategories(page, itemsPerPage)
      .then((data) => {
        setCategories(data.categories);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getCategories(currentPage, itemsPerPage, search)
      .then((data) => {
        setCategories(data.categories);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  }, [currentPage, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  
  const handleAddCategory = async () => {
    const isDuplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === newCategory.name.toLowerCase()
    );
  
    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại!");
      return;
    }
  
    try {
      await createCategory(newCategory); 
      fetchData(currentPage); 
      setNewCategory({ name: "", description: "" });
      setIsModalOpen(false);
      toast.success("Thêm danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };


  const handleUpdateCategory = async () => {
    const isDuplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === newCategory.name.toLowerCase() &&
        category._id !== currentCategoryId
    );

    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại!");
      return;
    }

    try {
      const updatedCategory = {
        name: newCategory.name,
        description: newCategory.description,
      };
      await updateCategory(currentCategoryId, updatedCategory);
      setCategories(
        categories.map((category) =>
          category._id === currentCategoryId
            ? { ...category, ...updatedCategory }
            : category
        )
      );
      setIsModalOpen(false);
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };

  // const handleDeleteCategory = async (categoryId) => {
  //   const isConfirmed = window.confirm(
  //     "Bạn có chắc chắn muốn xóa danh mục này?"
  //   );
  //   if (isConfirmed) {
  //     try {
  //       await deleteCategory(categoryId);
  //       // setCategories(
  //       //   categories.filter((category) => category._id !== categoryId)
  //       // );
  //       fetchData(currentPage); 
  //       toast.success("Xóa danh mục thành công!");
  //     } catch (error) {
  //       console.error("Lỗi khi xóa danh mục", error);
  //       toast.error("Có lỗi xảy ra khi xóa danh mục.");
  //     }
  //   }
  // };
  const handleDeleteCategory = async (categoryId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (isConfirmed) {
      try {
        const response = await deleteCategory(categoryId); // Gọi API
        if (response.status === 200) {
          fetchData(currentPage); // Tải lại dữ liệu
          toast.success("Xóa danh mục thành công!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục.");
      }
    }
  };
  
  const handleToggleActive = async (categoryId) => {
    const updatedCategory = categories.find((category) => category._id === categoryId);
    const newStatus = !updatedCategory.isActive;
  
    try {
      await updateCategoryStatus(categoryId, newStatus); // Gọi API
      setCategories(
        categories.map((category) =>
          category._id === categoryId ? { ...category, isActive: newStatus } : category
        )
      );
      toast.success(`Trạng thái đã được ${newStatus ? "mở" : "khóa"} thành công!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };
  
  // const handleToggleActive = (categoryId) => {
  //   const updatedCategory = categories.find(
  //     (category) => category._id === categoryId
  //   );
  //   const newStatus = !updatedCategory.isActive;

  //   // Cập nhật trạng thái chỉ sau khi thành công từ API
  //   updateCategoryStatus(categoryId, newStatus)
  //     .then(() => {
  //       setCategories(
  //         categories.map((category) =>
  //           category._id === categoryId
  //             ? { ...category, isActive: newStatus }
  //             : category
  //         )
  //       );
  //       toast.success(
  //         `Trạng thái đã được ${newStatus ? "mở" : "khóa"} thành công!`
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi cập nhật trạng thái:", error);
  //       toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
  //     });
  // };


  const openModalForAdd = () => {
    setNewCategory({ name: "", description: "" });
    setCurrentCategoryId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setCurrentCategoryId(category._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };
  
  return (
    <div className="category-admin">
      <div className="category-header">
        <h1>Quản Lý Danh Mục</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="category-search"
          onChange={handleSearchChange}
        />
        <button onClick={openModalForAdd} className="add-category-btn">
          <FaPlusCircle /> Thêm Mới Danh Mục
        </button>
      </div>

      <div className="category-table">
        <table>
          <thead>
            <tr>
              <th>CategoryID</th>
              <th>Tên Danh Mục</th>
              <th>Mô Tả</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            { categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.categoryID}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <div className="category-actions">
                      {" "}
                      <button
                        className="edit-btn-category"
                        onClick={() => openModalForEdit(category)}
                      >
                        <span className="icon-category">
                          <FaEdit />
                        </span>
                      </button>
                      <button
                        className="delete-btn-category"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <span className="icon-category">
                          <FaTrashAlt />
                        </span>
                      </button>
                      <button
                        onClick={() => handleToggleActive(category._id)}
                        className="active-btn-category"
                      >
                        {category.isActive ? (
                          <span className="icon-category">
                            <FaLockOpen />
                          </span>
                        ) : (
                          <span className="icon-category">
                            <FaLock />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {isModalOpen && (
        <div className="modal-box-category">
          <div className="modal-content-category">
            <button className="close-btn-category" onClick={closeModal}>
              x
            </button>
            <h2>
              {currentCategoryId ? "Cập Nhật Danh Mục" : "Thêm Mới Danh Mục"}
            </h2>
            <input
              type="text"
              placeholder="Tên Danh Mục"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <textarea
              placeholder="Mô tả"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              rows="4"
            />
            <div className="modal-actions-category">
              <button
                onClick={
                  currentCategoryId ? handleUpdateCategory : handleAddCategory
                }
              >
                {currentCategoryId ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CategoryManagement;
