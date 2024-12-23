import React, { useEffect, useState } from "react";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  fetchBrands,
  updateBrandActive,
} from "../services/brandServicesAdmin";
import "../styles/BrandManagement.css";
import Pagination from "../components/Pagination"; // Import Pagination
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLock,
  FaLockOpen,
  
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const [search, setSearch] = useState("");
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = (page) => {
    fetchBrands(page, itemsPerPage)
      .then((data) => {
        setBrands(data.brands);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);


  useEffect(() => {
    fetchBrands(currentPage, itemsPerPage, search)
      .then((data) => {
        setBrands(data.brands);
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

  const handleAddBrand = () => {
    if (!newBrand.name || !newBrand.description) {
      toast.error("Tên và mô tả thương hiệu không được để trống!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newBrand.name);
    formData.append("description", newBrand.description);
    if (newBrand.image) formData.append("image", newBrand.image);

    createBrand(formData)
      .then(() => {

        fetchData(currentPage);
        setNewBrand({ name: "", description: "", image: null });
        setIsModalOpen(false);
        toast.success("Thương hiệu đã được thêm thành công!");
      })
      .catch((error) => console.error("Lỗi khi thêm thương hiệu:", error));
  };

  const handleUpdateBrand = () => {
    if (!editingBrand || !newBrand.name || !newBrand.description) {
      toast.error("Tên và mô tả thương hiệu không được để trống!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newBrand.name);
    formData.append("description", newBrand.description);

    if (newBrand.image) {
      formData.append("image", newBrand.image);
    } else {
      formData.append("image", editingBrand.image_url);
    }

    updateBrand(editingBrand._id, formData)
      .then((updatedBrandData) => {
        setBrands(
          brands.map((brand) =>
            brand._id === editingBrand._id ? updatedBrandData : brand
          )
        );
        setNewBrand({ name: "", description: "", image: null });
        setEditingBrand(null);
        setIsModalOpen(false);
        toast.success("Thương hiệu đã được cập nhật thành công!");
      })
      .catch((error) => console.error("Lỗi khi cập nhật thương hiệu:", error));
  };


  const handleDeleteBrand = (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?");
    if (isConfirmed) {
      deleteBrand(id)
        .then(() => {
          setBrands(brands.filter((brand) => brand._id !== id));
          toast.success("Thương hiệu đã được xóa thành công!");
        })
        .catch((error) => {
          // Hiển thị lỗi lên Toast
          toast.error(`Lỗi khi xóa thương hiệu: ${error.message}`);
        });
    }
  };


  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setNewBrand({
      name: brand.name,
      description: brand.description,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingBrand(null);
    setNewBrand({ name: "", description: "", image: null });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleImageUpload = (e) => {
    setNewBrand({ ...newBrand, image: e.target.files[0] });
  };

  const handleSearchChange = (event) => {
  setSearch(event.target.value);
  setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
};


  // const filteredBrands = brands.filter((brand) =>
  //   brand.name.toLowerCase().includes(search.toLowerCase())
  // );

  const handleToggleActive = (brandId) => {
    const updatedBrand = brands.find((brand) => brand._id === brandId);
    const newStatus = !updatedBrand.isActive;

    updateBrandActive(brandId, newStatus)
      .then(() => {
        setBrands(
          brands.map((brand) =>
            brand._id === brandId ? { ...brand, isActive: newStatus } : brand
          )
        );
        toast.success(
          `Trạng thái đã được ${newStatus ? "mở" : "khóa"} thành công!`
        );
      })
      .catch((error) => console.error("Lỗi khi cập nhật trạng thái:", error));
  };

  return (
    <div className="brand-admin">
      <div className="brand-header">
        <h1>Quản lý Thương Hiệu</h1>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          className="category-search"
          onChange={handleSearchChange}
        />

        <button className="add-brand-btn" onClick={handleOpenModal}>
          <FaPlusCircle /> Thêm Mới
        </button>
      </div>
      <div className="brand-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô Tả</th>
              <th>Ảnh</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td>{brand.brandID}</td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>
                  <img src={brand.image_url} alt={brand.name} width="80" />
                </td>
                <td>
                  <div className="brand-actions">
                    <button
                      onClick={() => handleEditBrand(brand)}
                      title="Sửa"
                      className="edit-btn-brand"
                    >
                      <span className="icon-brand">
                        <FaEdit />
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand._id)}
                      title="Xóa"
                      className="delete-btn-brand"
                    >
                      <span className="icon-brand">
                        {" "}
                        <FaTrashAlt />
                      </span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(brand._id)}
                      className="active-btn-brand"
                    >
                      {brand.isActive ? (
                        <span className="icon-brand">
                          <FaLockOpen className="FaLockOpen" />
                        </span>
                      ) : (
                        <span className="icon-brand">
                          <FaLock className="FaLockOpen" />
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
        <div className="modal-box-brands">
          <div className="modal-content-brands">
            <button className="close-btn-brands" onClick={handleCloseModal}>
              x
            </button>
            <h2>{editingBrand ? "Sửa Thương Hiệu" : "Thêm Mới Thương Hiệu"}</h2>
            <input
              type="text"
              placeholder="Tên thương hiệu"
              value={newBrand.name}
              onChange={(e) =>
                setNewBrand({ ...newBrand, name: e.target.value })
              }
            />
            <textarea
              placeholder="Mô tả thương hiệu"
              value={newBrand.description}
              onChange={(e) =>
                setNewBrand({ ...newBrand, description: e.target.value })
              }
            />
            {(editingBrand && editingBrand.image_url) || newBrand.image ? (
              <div className="image-preview">
                <p>Ảnh:</p>
                <img
                  src={
                    newBrand.image
                      ? URL.createObjectURL(newBrand.image)
                      : editingBrand.image_url
                  }
                  alt="Ảnh thương hiệu"
                  width="100"
                />
              </div>
            ) : null}
            <input type="file" onChange={handleImageUpload} />
            <div className="modal-actions-brands">
              <button
                onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
              >
                {editingBrand ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BrandManagement;
