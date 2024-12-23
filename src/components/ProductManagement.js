import React, { useEffect, useState } from "react";
import {
  updateProductActive,
  deleteProduct,
  getAllProducts,
} from "../services/productServicesAdmin";

import { useNavigate } from "react-router-dom";
import "../styles/ProductManagement.css";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
  FaEye,
  FaImage,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../components/Pagination";
const ProductManagement = () => {
  const navigate = useNavigate();

  //Xử lí phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  //Xử lý search 
  const [search, setSearch] = useState("");
  useEffect(() => {
    getAllProducts(currentPage, itemsPerPage, search)
      .then((data) => {
        setProducts(data.data);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  }, [currentPage, search]);
  
 
  //Product
  const [products, setProducts] = useState([]);

  //Load dữ liệu
  const fetchData = (page) => {
    getAllProducts(page, itemsPerPage)
      .then((data) => {
        console.log(data);
        setProducts(data.data);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Xử lí đẩy qua trang quản lý hình ảnh sản phẩm
  const goToImageManagement = (productId) => {
    navigate(`/dashboard/image-management/${productId}`);
  };

  // Xử lí Actions Product
  const handleActionProduct = (productId, action) => {
    if (action === "edit") {
      navigate(`/dashboard/action-product/edit/${productId}`); // Điều hướng tới trang chỉnh sửa sản phẩm
    } else if (action === "view") {
      navigate(`/dashboard/action-product/view/${productId}`); // Điều hướng tới trang xem sản phẩm
    } else if (action === "add") {
      navigate(`/dashboard/action-product/add`); // Điều hướng tới trang thêm mới sản phẩm
    }
  };

  // Hàm xử lý: khóa + mở hoạt động sản phẩm
  const handleToggleActiveProduct = (productId) => {
    const productToUpdate = products.find(
      (product) => product._id === productId
    );

    if (!productToUpdate) {
      console.error("Không tìm thấy sản phẩm!");
      return;
    }

    // Lật trạng thái isActive
    const newIsActive = !productToUpdate.isActive;

    updateProductActive(productId, { isActive: newIsActive })
      .then(() => {
        setProducts(
          products.map((product) =>
            product._id === productId
              ? { ...product, isActive: newIsActive }
              : product
          )
        );
        toast.success("Trạng thái sản phẩm đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        toast.error("Lỗi khi cập nhật trạng thái sản phẩm.");
      });
  };

  // Hàm xóa sản phẩm
  // const handleDeleteProduct = (id) => {
  //   const isConfirmed = window.confirm(
  //     "Bạn có chắc chắn muốn xóa sản phẩm này?"
  //   );
  //   if (isConfirmed) {
  //     deleteProduct(id)
  //       .then(() => {
  //         setProducts(products.filter((product) => product._id !== id));
  //         toast.success("Sản phẩm đã được xóa thành công!");
  //       })
  //       .catch((error) => console.error("Lỗi khi xóa sản phẩm:", error));
  //   }
  // };
  const handleDeleteProduct = (id) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
  
    if (isConfirmed) {
      deleteProduct(id)
        .then(() => {
          setProducts(products.filter((product) => product._id !== id));
          toast.success("Sản phẩm đã được xóa thành công!");
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
          // Hiển thị lỗi từ server
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Đã xảy ra lỗi khi xóa sản phẩm.");
          }
        });
    }
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };
  
  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Quản Lý Sản Phẩm</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="product-search"
          onChange={handleSearchChange}
        />
        <button
          className="add-product-btn"
          onClick={() => handleActionProduct(null, "add")}
        >
          <FaPlusCircle /> Thêm Mới
        </button>
      </div>
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô Tả</th>
              <th>Ảnh</th>
              <th>Số Lượng</th>
              <th>Đã Bán</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productCode}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="image-product-primary"
                  />
                </td>
                <td>{product.stock}</td>
                <td>{product.sold}</td>
                <td>
                  <div className="product-actions">
                    <button
                      className="seen-btn-product"
                      onClick={() => handleActionProduct(product._id, "view")}
                    >
                      <span className="icon-product">
                        <FaEye />
                      </span>
                    </button>
                    <button
                      title="Sửa"
                      className="edit-btn-product"
                      onClick={() => handleActionProduct(product._id, "edit")}
                    >
                      <span className="icon-product">
                        <FaEdit />
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      title="Xóa"
                      className="delete-btn-product"
                    >
                      <span className="icon-product">
                        <FaTrashAlt />
                      </span>
                    </button>
                    <button
                      onClick={() => handleToggleActiveProduct(product._id)}
                      className="active-btn-product"
                    >
                      {product.isActive ? (
                        <span className="icon-product">
                          <FaLockOpen className="FaLockOpen" />
                        </span>
                      ) : (
                        <span className="icon-product">
                          <FaLock className="FaLockOpen" />
                        </span>
                      )}
                    </button>
                    <button
                      className="image-btn-product"
                      onClick={() => goToImageManagement(product._id)}
                    >
                      <span className="icon-product">
                        <FaImage />
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
