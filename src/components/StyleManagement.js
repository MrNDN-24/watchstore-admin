import React, { useEffect, useState } from "react";
import {
  getStyles,
  createStyle,
  updateStyle,
  deleteStyle,
  updateStyleStatus,
} from "../services/styleServicesAdmin";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import "../styles/StyleManagement.css";
import Pagination from "../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyleManagement = () => {
  const [styles, setStyles] = useState([]);
  const [newStyle, setNewStyle] = useState({ name: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStyleId, setCurrentStyleId] = useState(null);
  const [search, setSearch] = useState("");
  // Phân Trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; 
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchData = (page) => {
    getStyles(page, itemsPerPage)
      .then((data) => {
        setStyles(data.styles);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getStyles(currentPage, itemsPerPage, search)
      .then((data) => {
        setStyles(data.styles);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  }, [currentPage, search]);
  
  const handleAddStyle = async () => {
    const isDuplicate = styles.some(
      (style) => style.name.toLowerCase() === newStyle.name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Tên style đã tồn tại!");
      return;
    }

    try {
      await createStyle(newStyle);
     fetchData(currentPage); 
      setNewStyle({ name: "", description: "" });
      setIsModalOpen(false);
      toast.success("Thêm style thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm style", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };

  const handleUpdateStyle = async () => {
    const isDuplicate = styles.some(
      (style) =>
        style.name.toLowerCase() === newStyle.name.toLowerCase() &&
        style._id !== currentStyleId
    );

    if (isDuplicate) {
      toast.error("Tên style đã tồn tại!");
      return;
    }

    try {
      const updatedStyle = {
        name: newStyle.name,
        description: newStyle.description,
      };
      await updateStyle(currentStyleId, updatedStyle);
      setStyles(
        styles.map((style) =>
          style._id === currentStyleId ? { ...style, ...updatedStyle } : style
        )
      );
      setIsModalOpen(false);
      toast.success("Cập nhật style thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật style", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };

  // const handleDeleteStyle = async (styleId) => {
  //   const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa style này?");
  //   if (isConfirmed) {
  //     try {
  //       await deleteStyle(styleId);
  //       setStyles(styles.filter((style) => style._id !== styleId));
  //       toast.success("Xóa style thành công!");
  //     } catch (error) {
  //       console.error("Lỗi khi xóa style", error);
  //       toast.error("Có lỗi xảy ra khi xóa style.");
  //     }
  //   }
  // };

  // const handleToggleActive = (styleId) => {
  //   const updatedStyle = styles.find((style) => style._id === styleId);
  //   const newStatus = !updatedStyle.isActive;

  //   updateStyleStatus(styleId, newStatus)
  //     .then(() => {
  //       setStyles(
  //         styles.map((style) =>
  //           style._id === styleId ? { ...style, isActive: newStatus } : style
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
  const handleDeleteStyle = async (styleId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa style này?");
    if (isConfirmed) {
      try {
        await deleteStyle(styleId); // Gọi API xóa style
        setStyles(styles.filter((style) => style._id !== styleId)); // Cập nhật lại danh sách
        toast.success("Xóa style thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa style", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa style.");
      }
    }
  };
  
  const handleToggleActive = (styleId) => {
    const updatedStyle = styles.find((style) => style._id === styleId);
    const newStatus = !updatedStyle.isActive;
  
    updateStyleStatus(styleId, newStatus) // Gọi API cập nhật trạng thái
      .then(() => {
        setStyles(
          styles.map((style) =>
            style._id === styleId ? { ...style, isActive: newStatus } : style
          )
        );
        toast.success(
          `Trạng thái đã được ${newStatus ? "mở" : "khóa"} thành công!`
        );
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
      });
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const openModalForAdd = () => {
    setNewStyle({ name: "", description: "" });
    setCurrentStyleId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (style) => {
    setNewStyle({ name: style.name, description: style.description });
    setCurrentStyleId(style._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="style-admin">
      <div className="style-header">
        <h1>Quản Lý Phong Cách</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="style-search"
          onChange={handleSearchChange}
        />
        <button onClick={openModalForAdd} className="add-style-btn">
          <FaPlusCircle /> Thêm Mới Phong Cách
        </button>
      </div>

      <div className="style-table">
        <table>
          <thead>
            <tr>
              <th>StyleID</th>
              <th>Tên Phong Cách</th>
              <th>Mô Tả</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {
              styles.map((style) => (
                <tr key={style._id}>
                  <td>{style.styleID}</td>
                  <td>{style.name}</td>
                  <td>{style.description}</td>
                  <td>
                    <div className="style-actions">
                      <button
                        className="edit-btn-style"
                        onClick={() => openModalForEdit(style)}
                      >
                        <span className="icon-style">
                          <FaEdit />
                        </span>
                      </button>
                      <button
                        className="delete-btn-style"
                        onClick={() => handleDeleteStyle(style._id)}
                      >
                        <span className="icon-style">
                          <FaTrashAlt />
                        </span>
                      </button>
                      <button
                        onClick={() => handleToggleActive(style._id)}
                        className="active-btn-style"
                      >
                        {style.isActive ? (
                          <span className="icon-style">
                            <FaLockOpen />
                          </span>
                        ) : (
                          <span className="icon-style">
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
        <div className="modal-box-style">
          <div className="modal-content-style">
            <button className="close-btn-style" onClick={closeModal}>x
            </button>
            <h2>
              {currentStyleId ? "Cập Nhật Phong Cách" : "Thêm Mới Phong Cách"}
            </h2>
            <input
              type="text"
              placeholder="Tên Phong Cách"
              value={newStyle.name}
              onChange={(e) =>
                setNewStyle({ ...newStyle, name: e.target.value })
              }
            />
            <textarea
              placeholder="Mô tả"
              value={newStyle.description}
              onChange={(e) =>
                setNewStyle({ ...newStyle, description: e.target.value })
              }
              rows="4"
            />
            <div className="modal-actions-style">
              <button
                onClick={currentStyleId ? handleUpdateStyle : handleAddStyle}
              >
                {currentStyleId ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StyleManagement;
