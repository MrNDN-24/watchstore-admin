import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  createProduct,
} from "../services/productServicesAdmin";
import { getStyles } from "../services/styleServicesAdmin";
import { getCategories } from "../services/categoryServicesAdmin";
import { fetchBrands } from "../services/brandServicesAdmin";
import Select from "react-select";
import "../styles/ViewActionProduct.css";
import { FaArrowLeft } from "react-icons/fa";
const ActionProductManagement = () => {
  const { productId, action } = useParams();
  const [product, setProduct] = useState({
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
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [styles, setStyles] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (action === "add") {
      setProduct({
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
  
      // Lấy dữ liệu categories, brands, styles khi thêm mới
      Promise.all([getCategories(), fetchBrands(), getStyles()])
        .then(([categoryRes, brandRes, styleRes]) => {
          setCategories(categoryRes.categories || []);
          setBrands(brandRes.brands || []);
          setStyles(styleRes.styles || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu:", error);
          setLoading(false);
        });
    } else {
      // Fetch dữ liệu nếu không phải thêm mới
      Promise.all([
        getProductById(productId),
        getCategories(),
        fetchBrands(),
        getStyles(),
      ])
        .then(([productRes, categoryRes, brandRes, styleRes]) => {
          if (productRes.success) {
            setProduct(productRes.data);
          }
          setCategories(categoryRes.categories || []);
          setStyles(styleRes.styles || []);
          setBrands(brandRes.brands || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu:", error);
          setLoading(false);
        });
    }
  }, [action, productId]);
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const selectedCategories = product.category_ids
      .map((categoryObj) => {
        const category = categories.find((c) => c._id === categoryObj._id);
        return category ? { value: category._id, label: category.name } : null;
      })
      .filter(Boolean);

    setSelectedCategories(selectedCategories);

    const availableCategoryOptions = categories
      .filter(
        (category) =>
          !product.category_ids.some(
            (categoryObj) => categoryObj._id === category._id
          )
      )
      .map((category) => ({
        value: category._id,
        label: category.name,
      }));

    setCategoryOptions(availableCategoryOptions);
  }, [categories, product.category_ids]);

  const handleCategoryChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);

    const updatedCategoryObjs = selectedIds
      .map((id) => {
        const category = categories.find((c) => String(c._id) === String(id));
        return category
          ? {
              _id: category._id,
              name: category.name,
            }
          : null;
      })
      .filter(Boolean);

    setProduct((prevProduct) => ({
      ...prevProduct,
      category_ids: updatedCategoryObjs,
    }));

    const updatedSelectedCategories = updatedCategoryObjs
      .map((categoryObj) => ({
        value: categoryObj._id,
        label: categoryObj.name,
      }))
      .filter(Boolean);

    setSelectedCategories(updatedSelectedCategories);

    const newCategoryOptions = categories
      .filter((category) => !selectedIds.includes(category._id))
      .map((category) => ({
        value: category._id,
        label: category.name,
      }));

    setCategoryOptions(newCategoryOptions);
  };

  const [styleOptions, setStyleOptions] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  useEffect(() => {
    const selectedStyles = product.style_ids
      .map((styleObj) => {
        const style = styles.find((s) => s._id === styleObj._id);
        return style ? { value: style._id, label: style.name } : null;
      })
      .filter(Boolean);

    setSelectedStyles(selectedStyles);

    const availableStyleOptions = styles
      .filter(
        (style) =>
          !product.style_ids.some((styleObj) => styleObj._id === style._id)
      )
      .map((style) => ({
        value: style._id,
        label: style.name,
      }));

    setStyleOptions(availableStyleOptions);
  }, [styles, product.style_ids]);

  const handleStyleChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);

    const updatedStyleObjs = selectedIds
      .map((id) => {
        const style = styles.find((s) => String(s._id) === String(id));
        return style
          ? {
              _id: style._id,
              name: style.name,
            }
          : null;
      })
      .filter(Boolean);

    setProduct((prevProduct) => ({
      ...prevProduct,
      style_ids: updatedStyleObjs,
    }));

    const updatedSelectedStyles = updatedStyleObjs
      .map((styleObj) => ({
        value: styleObj._id,
        label: styleObj.name,
      }))
      .filter(Boolean);

    setSelectedStyles(updatedSelectedStyles);

    const newStyleOptions = styles
      .filter((style) => !selectedIds.includes(style._id))
      .map((style) => ({
        value: style._id,
        label: style.name,
      }));

    setStyleOptions(newStyleOptions);
  };

  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    const selectedBrandFist = product.brand_id;
    const selectedBrand = brands.find(
      (brand) => brand._id === selectedBrandFist._id
    );
    if (selectedBrand) {
      setSelectedBrand({ value: selectedBrand._id, label: selectedBrand.name });
    } else {
      setSelectedBrand("");
    }

    const availableBrandOptions = brands
      .filter((brand) => brand._id !== product.brand_id)
      .map((brand) => ({
        value: brand._id,
        label: brand.name,
      }));

    setBrandOptions(availableBrandOptions);
  }, [brands, product.brand_id]);

  const handleBrandChange = (selectedOption) => {
    const selectedBrandObj = brands.find(
      (brand) => brand._id === selectedOption?.value
    );

    if (selectedBrandObj) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        brand_id: selectedBrandObj,
      }));

      setSelectedBrand({
        value: selectedBrandObj._id,
        label: selectedBrandObj.name,
      });

      const newBrandOptions = brands
        .filter((brand) => brand._id !== selectedOption?.value)
        .map((brand) => ({
          value: brand._id,
          label: brand.name,
        }));

      setBrandOptions(newBrandOptions);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        brand_id: "",
      }));
      setSelectedBrand("");
    }
  };

  //   const [categoryOptions, setCategoryOptions] = useState([]);
  //   const [selectedCategories, setSelectedCategories] = useState([]);

  //   useEffect(() => {
  //     console.log("Product Category IDs:", product.category_ids);
  //     const selectedCategories = product.category_ids
  //       .map((categoryObj) => {
  //         console.log("Category Obj ID:", categoryObj._id);
  //         const category = categories.find((c) => c._id === categoryObj._id);
  //         if (!category) {
  //           console.log("Category not found for ID:", categoryObj._id);
  //         }
  //         return category ? { value: category._id, label: category.name } : null;
  //       })
  //       .filter(Boolean);

  //     console.log("Selected Categories:", selectedCategories);
  //     setSelectedCategories(selectedCategories);

  //     const availableCategoryOptions = categories
  //       .filter(
  //         (category) =>
  //           !product.category_ids.some(
  //             (categoryObj) => categoryObj._id === category._id
  //           )
  //       )
  //       .map((category) => ({
  //         value: category._id,
  //         label: category.name,
  //       }));

  //     console.log("Available Category Options:", availableCategoryOptions);
  //     setCategoryOptions(availableCategoryOptions);
  //   }, [categories, product.category_ids]);

  //   const handleCategoryChange = (selectedOptions) => {
  //     console.log("Selected Options:", selectedOptions);

  //     const selectedIds = selectedOptions.map((option) => option.value);
  //     console.log("Selected IDs:", selectedIds);

  //     const updatedCategoryObjs = selectedIds
  //       .map((id) => {
  //         const category = categories.find((c) => String(c._id) === String(id));
  //         return category
  //           ? {
  //               _id: category._id,
  //               name: category.name,
  //             }
  //           : null;
  //       })
  //       .filter(Boolean);

  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       category_ids: updatedCategoryObjs,
  //     }));

  //     const updatedSelectedCategories = updatedCategoryObjs
  //       .map((categoryObj) => ({
  //         value: categoryObj._id,
  //         label: categoryObj.name,
  //       }))
  //       .filter(Boolean);

  //     console.log("Updated Selected Categories:", updatedSelectedCategories);
  //     setSelectedCategories(updatedSelectedCategories);

  //     const newCategoryOptions = categories
  //       .filter((category) => !selectedIds.includes(category._id))
  //       .map((category) => ({
  //         value: category._id,
  //         label: category.name,
  //       }));

  //     console.log("New Category Options:", newCategoryOptions);
  //     setCategoryOptions(newCategoryOptions);
  //   };

  //   const [styleOptions, setStyleOptions] = useState([]);
  //   const [selectedStyles, setSelectedStyles] = useState([]);

  //   useEffect(() => {
  //     console.log("Product Style IDs:", product.style_ids);
  //     const selectedStyles = product.style_ids
  //       .map((styleObj) => {
  //         console.log("Style Obj ID:", styleObj._id);
  //         const style = styles.find((s) => s._id === styleObj._id);
  //         if (!style) {
  //           console.log("Style not found for ID:", styleObj._id);
  //         }
  //         return style ? { value: style._id, label: style.name } : null;
  //       })
  //       .filter(Boolean);

  //     console.log("Selected Styles:", selectedStyles);
  //     setSelectedStyles(selectedStyles);

  //     const availableStyleOptions = styles
  //       .filter(
  //         (style) =>
  //           !product.style_ids.some((styleObj) => styleObj._id === style._id)
  //       )
  //       .map((style) => ({
  //         value: style._id,
  //         label: style.name,
  //       }));

  //     console.log("Available Style Options:", availableStyleOptions);
  //     setStyleOptions(availableStyleOptions);
  //   }, [styles, product.style_ids]);

  //   const handleStyleChange = (selectedOptions) => {
  //     console.log("Selected Options:", selectedOptions);

  //     const selectedIds = selectedOptions.map((option) => option.value);
  //     console.log("Selected IDs:", selectedIds);

  //     // Tạo lại các đối tượng style từ selectedIds
  //     const updatedStyleObjs = selectedIds
  //       .map((id) => {
  //         const style = styles.find((s) => String(s._id) === String(id));
  //         return style
  //           ? {
  //               _id: style._id,
  //               name: style.name,
  //             }
  //           : null;
  //       })
  //       .filter(Boolean);

  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       style_ids: updatedStyleObjs, // Cập nhật style_ids với các đối tượng đầy đủ
  //     }));

  //     const updatedSelectedStyles = updatedStyleObjs
  //       .map((styleObj) => ({
  //         value: styleObj._id,
  //         label: styleObj.name,
  //       }))
  //       .filter(Boolean);

  //     console.log("Updated Selected Styles:", updatedSelectedStyles);
  //     setSelectedStyles(updatedSelectedStyles);

  //     const newStyleOptions = styles
  //       .filter((style) => !selectedIds.includes(style._id))
  //       .map((style) => ({
  //         value: style._id,
  //         label: style.name,
  //       }));

  //     console.log("New Style Options:", newStyleOptions);
  //     setStyleOptions(newStyleOptions);
  //   };

  //   const [brandOptions, setBrandOptions] = useState([]);
  //   const [selectedBrand, setSelectedBrand] = useState("");

  //   useEffect(() => {
  //     console.log("Product Brand ID:", product.brand_id);

  //     const selectedBrandFist = product.brand_id;
  //     // Tìm thương hiệu đã chọn từ danh sách brands
  //     const selectedBrand = brands.find(
  //       (brand) => brand._id === selectedBrandFist._id
  //     );
  //     if (selectedBrand) {
  //       setSelectedBrand({ value: selectedBrand._id, label: selectedBrand.name });
  //     } else {
  //       setSelectedBrand(""); // Nếu không tìm thấy thương hiệu, thiết lập lại
  //     }

  //     // Cập nhật các brandOptions (chỉ những brand chưa được chọn)
  //     const availableBrandOptions = brands
  //       .filter((brand) => brand._id !== product.brand_id)
  //       .map((brand) => ({
  //         value: brand._id,
  //         label: brand.name,
  //       }));

  //     console.log("Available Brand Options:", availableBrandOptions);
  //     setBrandOptions(availableBrandOptions);
  //   }, [brands, product.brand_id]);

  //   const handleBrandChange = (selectedOption) => {
  //     console.log("Selected Brand:", selectedOption);
  //     const selectedBrandObj = brands.find((brand) => brand._id === selectedOption?.value);

  //     // Nếu tìm thấy brand, cập nhật brand_id với đối tượng đầy đủ
  //     if (selectedBrandObj) {
  //       setProduct((prevProduct) => ({
  //         ...prevProduct,
  //         brand_id: selectedBrandObj,  // Cập nhật brand_id với đối tượng brand đầy đủ
  //       }));

  //       // Cập nhật selectedBrand state
  //       setSelectedBrand({
  //         value: selectedBrandObj._id,
  //         label: selectedBrandObj.name,
  //       });

  //       // Cập nhật lại brandOptions nếu cần
  //       const newBrandOptions = brands
  //         .filter((brand) => brand._id !== selectedOption?.value)  // Loại bỏ brand đã chọn
  //         .map((brand) => ({
  //           value: brand._id,
  //           label: brand.name,
  //         }));

  //       console.log("New Brand Options:", newBrandOptions);
  //       setBrandOptions(newBrandOptions);
  //     } else {
  //       // Nếu không tìm thấy brand, thiết lập lại brand_id và selectedBrand
  //       setProduct((prevProduct) => ({
  //         ...prevProduct,
  //         brand_id: "",  // Thiết lập lại brand_id
  //       }));
  //       setSelectedBrand("");
  //     }
  //   };

  const handleSaveChanges = () => {
    if (action === "add") {
      createProduct(product)
        .then(() => {
          alert("Thêm sản phẩm thành công!");
          navigate("/dashboard/product-management");
        })
        .catch(() => alert("Lỗi khi thêm sản phẩm!"));
    } else {
      updateProduct(productId, product)
        .then(() => {
          alert("Cập nhật sản phẩm thành công!");
          navigate(`/dashboard/action-product/view/${productId}`);
        })
        .catch(() => alert("Lỗi khi cập nhật sản phẩm!"));
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  const handleGoBackAction = () => {
    navigate(`/dashboard/product-management`);
  };

  return (
    <div className="actionProduct">
      <button onClick={handleGoBackAction} className="backActionProduct">
        <FaArrowLeft /> Quay Lại
      </button>
      {action === "view" ? (
        <div className="infoProduct">
          <div className="infoProduct-container1">
            <img src={product.imageUrl} alt={product.name} width={100} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>

            <p>
              <strong>Giá:</strong> {product.price} VND
            </p>
            <p>
              <strong>Giá Khuyến Mãi:</strong> {product.discount_price} VND
            </p>
            <p>
              <strong>Danh Mục:</strong>{" "}
              {product.category_ids?.length > 0
                ? product.category_ids.map((category, index) => (
                    <span key={index}>
                      {category.name}
                      {index < product.category_ids.length - 1 && ", "}
                    </span>
                  ))
                : "Chưa có danh mục"}
            </p>
            <p>
              <strong>Phong Cách:</strong>{" "}
              {product.style_ids?.length > 0
                ? product.style_ids.map((style, index) => (
                    <span key={index}>
                      {style.name}
                      {index < product.style_ids.length - 1 && ", "}
                    </span>
                  ))
                : "Chưa có phong cách"}
            </p>
          </div>
          <div className="infoProduct-container2">
            <h3>Thông Số Kỹ Thuật</h3>
            <p>
              <strong>Thương Hiệu:</strong>{" "}
              {product.brand_id?.name || "Chưa có thương hiệu"}
            </p>
            <p>
              <strong>Giới Tính:</strong> {product.gender}
            </p>
            <p>
              <strong>Loại Dây:</strong> {product.strapType}
            </p>
            <p>
              <strong>Hình Dạng Mặt:</strong> {product.dialShape}
            </p>
            <p>
              <strong>Loại Kính:</strong> {product.glassType}
            </p>
            <p>
              <strong>Họa Tiết Mặt:</strong> {product.dialPattern}
            </p>
            <p>
              <strong>Màu Sắc Mặt:</strong> {product.dialColor}
            </p>
            <p>
              <strong>Khả Năng Chống Nước:</strong> {product.waterResistance}
            </p>
            <p>
              <strong>Xuất Xứ:</strong> {product.origin}
            </p>
          </div>
        </div>
      ) : (
        <div className="editProduct">
          <div className="editProduct-container1">
            <div className="inputGroup">
              <label htmlFor="productName">Tên Sản Phẩm</label>
              <input
                id="productName"
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="productDescription">Mô Tả</label>
              <textarea
                id="productDescription"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="categories">Danh Mục</label>
              <Select
                id="categories"
                isMulti
                value={selectedCategories}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Chọn danh mục"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="styles">Phong Cách</label>
              <Select
                id="styles"
                isMulti
                value={selectedStyles}
                onChange={handleStyleChange}
                options={styleOptions}
                placeholder="Chọn kiểu dáng"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="brand">Thương Hiệu</label>
              <Select
                id="brand"
                value={selectedBrand}
                onChange={handleBrandChange}
                options={brandOptions}
                placeholder="Chọn thương hiệu"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="price">Giá Sản Phẩm</label>
              <input
                id="price"
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="discountPrice">Giá Khuyến Mãi</label>
              <input
                id="discountPrice"
                type="number"
                value={product.discount_price}
                onChange={(e) =>
                  setProduct({ ...product, discount_price: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="stock">Số Lượng</label>
              <input
                id="stock"
                type="number"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </div>
          </div>
          <div className="editProduct-container2">
            <div className="inputGroup">
              <label htmlFor="gender">Giới Tính</label>
              <Select
                id="gender"
                value={{ value: product.gender, label: product.gender }}
                onChange={(selectedOption) =>
                  setProduct({ ...product, gender: selectedOption.value })
                }
                options={[
                  { value: "Unisex", label: "Unisex" },
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                ]}
                placeholder="Chọn giới tính"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="strapType">Loại Dây Đeo</label>
              <input
                id="strapType"
                type="text"
                value={product.strapType}
                onChange={(e) =>
                  setProduct({ ...product, strapType: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="dialShape">Hình Dáng Mặt Đồng Hồ</label>
              <input
                id="dialShape"
                type="text"
                value={product.dialShape}
                onChange={(e) =>
                  setProduct({ ...product, dialShape: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="glassType">Loại Kính</label>
              <input
                id="glassType"
                type="text"
                value={product.glassType}
                onChange={(e) =>
                  setProduct({ ...product, glassType: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="dialPattern">Họa Tiết Mặt Đồng Hồ</label>
              <input
                id="dialPattern"
                type="text"
                value={product.dialPattern}
                onChange={(e) =>
                  setProduct({ ...product, dialPattern: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="dialColor">Màu Mặt Đồng Hồ</label>
              <input
                id="dialColor"
                type="text"
                value={product.dialColor}
                onChange={(e) =>
                  setProduct({ ...product, dialColor: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="waterResistance">Chống Nước</label>
              <input
                id="waterResistance"
                type="text"
                value={product.waterResistance}
                onChange={(e) =>
                  setProduct({ ...product, waterResistance: e.target.value })
                }
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="origin">Xuất Xứ</label>
              <input
                id="origin"
                type="text"
                value={product.origin}
                onChange={(e) =>
                  setProduct({ ...product, origin: e.target.value })
                }
              />
            </div>
            {/* <button className="saveChangesButton" onClick={handleSaveChanges}>
              Lưu Thay Đổi
            </button> */}
            <button onClick={handleSaveChanges} className="saveChangesButton">
              {action === "add" ? "Thêm Mới" : "Cập Nhật"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionProductManagement;
