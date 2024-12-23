import React, { useEffect, useState } from "react";
import {
  fetchImages,
  addImage,
  updateImage,
  deleteImage,
} from "../services/imageServicesAdmin";
import "../styles/ImageManagement.css";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaCheckCircle,
  FaCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const ImageManagement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [newImage, setNewImage] = useState({
    description: "",
    image: null,
  });
  const [editingImage, setEditingImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("Product ID:", productId);


  // Lấy hình ảnh của sản phẩm theo productId
  useEffect(() => {
    fetchImages(productId)
      .then((data) => {
        console.log(data);
        setImages(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy hình ảnh:", error);
        toast.error("Lỗi khi lấy hình ảnh");
      });
  }, [productId]);
  const handleGoBackToProduct = () => {
    navigate(`/dashboard/product-management`); // Navigate back to the product page
  };
  const handleAddImage = () => {
    if (!newImage.image) {
      toast.error("Hình ảnh không được để trống!");
      return;
    }
    const formData = new FormData();
    formData.append("description", newImage.description);
    formData.append("productId", productId);
    if (newImage.image) formData.append("image", newImage.image);
    addImage(formData)
      .then((newImageData) => {
        setImages([...images, newImageData]);
        setNewImage({ description: "", image: null });
        setIsModalOpen(false);
        toast.success("Thêm hình ảnh thành công!");
      })
      .catch((error) => console.error("Lỗi khi thêm hình ảnh:", error));
  };
  const handleUpdateImage = () => {
    const formData = new FormData();
    formData.append("description", newImage.description);
    formData.append("productId", productId);
    if (newImage.image) {
      formData.append("image", newImage.image);
    } else {
      formData.append("image", editingImage.image_url);
    }

    updateImage(editingImage._id, formData)
      .then((updatedImageData) => {
        setImages(
          images.map((image) =>
            image._id === editingImage._id ? updatedImageData : image
          )
        );
        setNewImage({ description: "", image: null });
        setEditingImage(null);
        setIsModalOpen(false);
        toast.success("Cập nhật hình ảnh thành công!");
      })
      .catch((error) => console.error("Lỗi khi cập nhật hình ảnh:", error));
  };
  const handleDeleteImage = (id) => {
    deleteImage(id)
      .then(() => {
        setImages(images.filter((image) => image._id !== id));
        toast.success("Xóa hình ảnh thành công!");
      })
      .catch((error) => console.error("Lỗi khi xóa hình ảnh:", error));
  };
  // const handleTogglePrimary = (imageId) => {
  //   const updatedImage = images.find((image) => image._id === imageId);
  //   const newIsPrimary = !updatedImage.isPrimary;

  //   if (newIsPrimary) {
  //     const currentPrimaryImage = images.find((image) => image.isPrimary);
  //     if (currentPrimaryImage) {
  //       updateImage(currentPrimaryImage._id, { isPrimary: false })
  //         .then(() => {
  //           setImages((prevImages) =>
  //             prevImages.map((image) =>
  //               image._id === currentPrimaryImage._id
  //                 ? { ...image, isPrimary: false }
  //                 : image
  //             )
  //           );
  //         })
  //         .catch((error) => {
  //           console.error("Lỗi khi bỏ ảnh chính cũ:", error);
  //           toast.error("Không thể bỏ ảnh chính cũ. Vui lòng thử lại.");
  //         });
  //     }
  //   }

  //   updateImage(imageId, { isPrimary: newIsPrimary })
  //     .then(() => {
  //       setImages((prevImages) =>
  //         prevImages.map((image) =>
  //           image._id === imageId
  //             ? { ...image, isPrimary: newIsPrimary }
  //             : image
  //         )
  //       );
  //       toast.success(
  //         `Ảnh đã được ${
  //           newIsPrimary ? "chọn làm ảnh chính" : "bỏ làm ảnh chính"
  //         } thành công!`
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi cập nhật trạng thái isPrimary:", error);
  //       toast.error("Không thể cập nhật ảnh chính. Vui lòng thử lại.");
  //     });
  // };
  const handleTogglePrimary = (imageId) => {
    const updatedImage = images.find((image) => image._id === imageId);
    const newIsPrimary = !updatedImage.isPrimary;

    if (newIsPrimary) {
      const currentPrimaryImage = images.find(
        (image) => image.isPrimary && image.productId === updatedImage.productId
      );
      if (currentPrimaryImage) {
        updateImage(currentPrimaryImage._id, { isPrimary: false })
          .then(() => {
            setImages((prevImages) =>
              prevImages.map((image) =>
                image._id === currentPrimaryImage._id
                  ? { ...image, isPrimary: false }
                  : image
              )
            );
          })
          .catch((error) => {
            console.error("Error when removing old primary image:", error);
            toast.error("Không thể bỏ ảnh chính cũ. Vui lòng thử lại.");
          });
      }
    }

    updateImage(imageId, { isPrimary: newIsPrimary })
      .then(() => {
        setImages((prevImages) =>
          prevImages.map((image) =>
            image._id === imageId
              ? { ...image, isPrimary: newIsPrimary }
              : image
          )
        );
        toast.success(
          `Ảnh đã được ${
            newIsPrimary ? "chọn làm ảnh chính" : "bỏ làm ảnh chính"
          } thành công!`
        );
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái isPrimary:", error);
        toast.error("Không thể cập nhật ảnh chính. Vui lòng thử lại.");
      });
  };

  const handleEditImage = (image) => {
    setEditingImage(image);
    setNewImage({
      description: image.description,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingImage(null);
    setNewImage({ description: "", image: null });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const filteredImages = images.filter(
    (image) =>
      typeof image.description === 'string' &&
      image.description.toLowerCase().includes(search.toLowerCase())
  );
  
  console.log(filteredImages);  // Kiểm tra kết quả sau khi lọc
  

  const handleImageUpload = (e) => {
    setNewImage({ ...newImage, image: e.target.files[0] });
  };

  return (
    <div className="image-admin">
      <div className="image-header">
        <h1>Quản Lý Hình Ảnh</h1>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          className="image-search"
          onChange={handleSearchChange}
        />
        <button className="add-image-btn" onClick={handleOpenModal}>
          <FaPlusCircle /> Thêm mới
        </button>
        <button className="go-back-btn" onClick={handleGoBackToProduct}>
          <FaArrowLeft /> Quay lại
        </button>
      </div>
      <div className="image-table">
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.length > 0 ? (
              filteredImages.map((image) => (
                <tr key={image._id}>
                  <td>
                    <img
                      className="image-show"
                      src={image.image_url}
                      alt={image.description}
                    />
                  </td>
                  <td>{image.description}</td>

                  <td>
                    <div className="image-actions">
                      <button
                        onClick={() => handleEditImage(image)}
                        className="edit-btn-image"
                      >
                        <span className="icon-image">
                          <FaEdit />
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image._id)}
                        title="Xóa"
                        className="delete-btn-image"
                      >
                        <span className="icon-image">
                          <FaTrashAlt />
                        </span>
                      </button>
                      <button
                        onClick={() => handleTogglePrimary(image._id)}
                        className="toggle-btn-image"
                      >
                        {image.isPrimary ? (
                          <span className="icon-image">
                            <FaCheckCircle />
                          </span>
                        ) : (
                          <span className="icon-image">
                            <FaCircle />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Không có hình ảnh nào để hiển thị.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-box-images">
          <div className="modal-content-images">
            <button className="close-btn-images" onClick={handleCloseModal}>
              x
            </button>
            <h2>{editingImage ? "Sửa hình ảnh" : "Thêm mới hình ảnh"}</h2>
            <textarea
              placeholder="Mô tả hình ảnh"
              value={newImage.description}
              onChange={(e) =>
                setNewImage({ ...newImage, description: e.target.value })
              }
            />
            {(editingImage && editingImage.image_url) || newImage.image ? (
              <div className="image-preview">
                <p>Ảnh:</p>
                <img
                  src={
                    newImage.image
                      ? URL.createObjectURL(newImage.image)
                      : editingImage.image_url
                  }
                  alt="Ảnh thương hiệu"
                  width="100"
                />
              </div>
            ) : null}
            <input type="file" onChange={handleImageUpload} />
            <div className="modal-actions-images">
              <button
                onClick={editingImage ? handleUpdateImage : handleAddImage}
              >
                {editingImage ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ImageManagement;
