import React, { useEffect, useState } from "react";
import {
  createProduct,
  updateProductActive,
  deleteProduct,
  getAllProducts,
} from "../services/productServicesAdmin";
import { getStyles } from "../services/styleServicesAdmin";
import { getCategories } from "../services/categoryServicesAdmin";
import { fetchBrands } from "../services/brandServicesAdmin";
import "../styles/InventoryManagement.css";
import Select from "react-select";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
  FaEye,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryM = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    style_ids: [],
    category_ids: [],
    brand_id: "",
    gender: "Unisex",
    origin: "",
    strapType: "",
    dialShape: "",
    glassType: "",
    dialPattern: "",
    dialColor: "",
    waterResistance: "",
  });
  const [styles, setStyles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const productData = await getAllProducts();
      if (Array.isArray(productData)) setProducts(productData);

      const styleData = await getStyles();
      if (styleData?.styles) setStyles(styleData.styles);

      const categoryData = await getCategories();
      if (categoryData?.categories) setCategories(categoryData.categories);

      const brandData = await fetchBrands();
      if (Array.isArray(brandData)) setBrands(brandData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu ban đầu:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const formattedProduct = {
        ...newProduct,
        price: Number(newProduct.price), // Đảm bảo là số
        stock: Number(newProduct.stock), // Đảm bảo là số
      };

      console.log("Dữ liệu sản phẩm chuẩn bị gửi:", formattedProduct);

      const addedProduct = await createProduct(formattedProduct);
      setProducts([...products, addedProduct]);
      toast.success("Sản phẩm đã được thêm thành công!");
      resetForm();
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Lỗi khi thêm sản phẩm.");
    }
  };

  const handleUpdateProduct = async () => {
    // if (!editingProduct) return;

    // try {
    //   const updatedProduct = await updateProduct(
    //     editingProduct._id,
    //     newProduct
    //   );
    //   setProducts(
    //     products.map((product) =>
    //       product._id === editingProduct._id ? updatedProduct : product
    //     )
    //   );
    //   toast.success("Sản phẩm đã được cập nhật thành công!");
    //   resetForm();
    // } catch (error) {
    //   console.error("Lỗi khi cập nhật sản phẩm:", error);
    //   toast.error("Lỗi khi cập nhật sản phẩm.");
    // }
  };

  useEffect(() => {
    console.log("New Product after setting:", newProduct); // Log sau khi newProduct đã được cập nhật
  }, [newProduct]); // useEffect này chỉ chạy khi newProduct thay đổi

  const handleEditProduct = (product) => {
    console.log("Product to edit:", product); // Kiểm tra giá trị của product truyền vào
    setEditingProduct(product);
    setNewProduct({ ...product }); // Set giá trị mới cho newProduct
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      style_ids: [],
      category_ids: [],
      brand_id: "",
      gender: "Unisex",
      origin: "",
      strapType: "",
      dialShape: "",
      glassType: "",
      dialPattern: "",
      dialColor: "",
      waterResistance: "",
    });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleToggleActiveProduct = (productId) => {
    const productToUpdate = products.find(
      (product) => product._id === productId
    );

    if (!productToUpdate) {
      console.error("Không tìm thấy sản phẩm!");
      return;
    }

    const updatedProduct = {
      ...productToUpdate,
      isActive: !productToUpdate.isActive,
    };

    updateProductActive(productId, updatedProduct)
      .then(() => {
        setProducts(
          products.map((product) =>
            product._id === productId ? updatedProduct : product
          )
        );
        toast.success("Trạng thái sản phẩm đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        toast.error("Lỗi khi cập nhật trạng thái sản phẩm.");
      });
  };

  const handleOpenModal = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      style_ids: [],
      category_ids: [],
      brand_id: "",
      gender: "Unisex",
      origin: "",
      strapType: "",
      dialShape: "",
      glassType: "",
      dialPattern: "",
      dialColor: "",
      waterResistance: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSearchChange = (event) => setSearch(event.target.value);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteProduct = (id) => {
    deleteProduct(id)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
        toast.success("Sản phẩm đã được xóa thành công!");
      })
      .catch((error) => console.error("Lỗi khi xóa sản phẩm:", error));
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Quản Lý Nhập Kho</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={handleSearchChange}
          className="inventory-search"
        />
        <button className="add-inventory-btn" onClick={handleOpenModal}>
          <FaPlusCircle /> Thêm Mới
        </button>
      </div>
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô Tả</th>
              <th>Số Lượng</th>
              <th>Số Lượng Đã Bán</th>
              <th>Hành Động</th>

            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.productCode}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.stock}</td>
                <td>{product.sold}</td>
                <td>
                  <div className="inventory-actions">
                    <button className="seen-btn-inventory">
                      <span className="icon-inventory">
                        <FaEye />
                      </span>
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      title="Sửa"
                      className="edit-btn-inventory"
                    >
                      <span className="icon-inventory">
                        <FaEdit />
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      title="Xóa"
                      className="delete-btn-inventory"
                    >
                      <span className="icon-inventory">
                        <FaTrashAlt />
                      </span>
                    </button>
                    <button
                      onClick={() => handleToggleActiveProduct(product._id)}
                      className="active-btn-inventory"
                    >
                      {product.isActive ? (
                        <span className="icon-inventory">
                          <FaLockOpen className="FaLockOpen" />
                        </span>
                      ) : (
                        <span className="icon-inventory">
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
      {isModalOpen && (
        <div className="inventory-modal">
          <div className="inventory-modal-content">
            <h2>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h2>
            <button className="close-btn-inventory" onClick={handleCloseModal}>
              ×
            </button>
            <div className="inventory-form-container">
              <div className="inventory-form1">
                <div className="inventory-form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Nhập tên sản phẩm"
                    className="inventory-input"
                  />
                </div>

                <div className="inventory-form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="Nhập giá sản phẩm"
                    className="inventory-input"
                  />
                </div>
                <div className="inventory-form-group">
                  <label>Số Lượng</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="Nhập giá sản phẩm"
                    className="inventory-input"
                  />
                </div>

                <div className="inventory-form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="Nhập mô tả sản phẩm"
                    className="inventory-textarea"
                  />
                </div>
                <div className="inventory-form-group">
                <label>Danh Mục</label>
                <Select
                  isMulti
                  options={categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                  value={
                    newProduct.category_ids && categories.length > 0
                      ? newProduct.category_ids
                          .map((categoryId) => {
                      
                            const category = categories.find(
                              (cat) => cat._id === categoryId
                            );
          
                            return category
                              ? { value: category._id, label: category.name }
                              : null;
                          })
                          .filter(Boolean) // Loại bỏ giá trị null
                      : []
                  }
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions.map(
                      (option) => option.value
                    );
                    setNewProduct((prevProduct) => ({
                      ...prevProduct,
                      category_ids: selectedIds,
                    }));
                  }}
                  placeholder="Chọn danh mục"
                  className="product-select"
                />
                </div>
                <div className="inventory-form-group">
                <label>Phong Cách</label>
                <Select
                  isMulti
                  options={styles.map((style) => ({
                    value: style._id,
                    label: style.name,
                  }))}
                  value={
                    newProduct.style_ids && styles.length > 0
                      ? newProduct.style_ids
                          .map((styleId) => {
                            const style = styles.find(
                              (cat) => cat._id === styleId
                            );
                            return style
                              ? { value: style._id, label: style.name }
                              : null;
                          })
                          .filter(Boolean) 
                      : []
                  }
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions.map(
                      (option) => option.value
                    );
                    setNewProduct((prevProduct) => ({
                      ...prevProduct,
                      style_ids: selectedIds,
                    }));
                  }}
                  placeholder="Chọn danh mục"
                  className="product-select"
                />
                </div>
                <div className="product-form-group">
                  <label>Thương hiệu</label>
                  <Select
                    options={brands.map((brand) => ({
                      value: brand._id,
                      label: brand.name,
                    }))}
                    value={
                      brands.find((brand) => brand._id === newProduct.brand_id)
                        ? {
                            value: newProduct.brand_id,
                            label: brands.find(
                              (brand) => brand._id === newProduct.brand_id
                            ).name,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setNewProduct({
                        ...newProduct,
                        brand_id: selectedOption?.value || "",
                      })
                    }
                    placeholder="Chọn thương hiệu"
                    className="product-select"
                  />
                </div>

                <div className="inventory-form-group">
                  <label>Giới tính</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, gender: e.target.value })
                    }
                    className="inventory-select"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="inventory-form2">
                {[
                  { label: "Xuất xứ", field: "origin" },
                  { label: "Loại dây", field: "strapType" },
                  { label: "Hình dạng mặt", field: "dialShape" },
                  { label: "Loại kính", field: "glassType" },
                  { label: "Hoa văn mặt", field: "dialPattern" },
                  { label: "Màu mặt", field: "dialColor" },
                  { label: "Chống nước", field: "waterResistance" },
                ].map(({ label, field }) => (
                  <div className="inventory-form-group" key={field}>
                    <label>{label}</label>
                    <input
                      type="text"
                      value={newProduct[field]}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [field]: e.target.value,
                        })
                      }
                      placeholder={`Nhập ${label.toLowerCase()}`}
                      className="inventory-input"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="inventory-submit-btn"
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
            >
              {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default InventoryM;
