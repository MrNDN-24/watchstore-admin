import React, { useEffect, useState } from "react";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/discountServicesAdmin";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import "../styles/DiscountManagement.css";
import Pagination from "../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    discountValue: 0,
    expirationDate: "",
    startDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiscountId, setCurrentDiscountId] = useState(null);

  // Phân Trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
    //Xử lý search 
    const [search, setSearch] = useState("");
    useEffect(() => {
      getDiscounts(currentPage, itemsPerPage, search)
        .then((data) => {
          setDiscounts(data.discounts);
          setCurrentPage(data.page);
          setTotalPages(data.totalPages);
        })
        .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
    }, [currentPage, search]);

  const fetchData = (page) => {
    getDiscounts(page, itemsPerPage)
      .then((data) => {
        setDiscounts(data.discounts);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleAddDiscount = async () => {
    console.log("Adding new discount:", newDiscount); 
    const isDuplicate = discounts.some(
      (discount) =>
        discount.code.toLowerCase() === newDiscount.code.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Mã giảm giá đã tồn tại!");
      return;
    }

    try {
      await createDiscount(newDiscount);
      console.log(newDiscount);
      fetchData(currentPage);
      setNewDiscount({
        code: "",
        description: "",
        discountValue: 0,
        expirationDate: "",
        startDate: "",
      });
      setIsModalOpen(false);
      toast.success("Thêm mã giảm giá thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mã giảm giá", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };

  const handleUpdateDiscount = async () => {
    // Kiểm tra trùng mã giảm giá
    const isDuplicate = discounts.some(
      (discount) =>
        discount.code.toLowerCase() === newDiscount.code.toLowerCase() &&
        discount._id !== currentDiscountId
    );

    if (isDuplicate) {
      toast.error("Mã giảm giá đã tồn tại!");
      return;
    }

    try {
      // Chỉ cập nhật các thông tin khác, không thay đổi 'code' và 'isActive'
      const updatedDiscount = {
        description: newDiscount.description,
        discountValue: newDiscount.discountValue,
        startDate: newDiscount.startDate,
        expirationDate: newDiscount.expirationDate,
      };

      // Gọi API để cập nhật mã giảm giá (chỉ gửi dữ liệu không bao gồm 'isActive')
      await updateDiscount(newDiscount.code, updatedDiscount);

      // Cập nhật danh sách discount sau khi thành công
      setDiscounts(
        discounts.map((discount) =>
          discount._id === currentDiscountId
            ? { ...discount, ...updatedDiscount }
            : discount
        )
      );

      // Đóng modal và hiển thị thông báo thành công
      setIsModalOpen(false);
      toast.success("Cập nhật mã giảm giá thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật mã giảm giá", error);
      toast.error("Không được để trống dữ liệu.");
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa mã giảm giá này?"
    );
    if (isConfirmed) {
      try {
        const code = discounts.find(
          (discount) => discount._id === discountId
        ).code;
        await deleteDiscount(code); // Gửi 'code' thay vì 'discountId'
        setDiscounts(
          discounts.filter((discount) => discount._id !== discountId)
        );
        toast.success("Xóa mã giảm giá thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá", error);
        toast.error("Có lỗi xảy ra khi xóa mã giảm giá.");
      }
    }
  };

  const handleToggleActive = (discountId) => {
    const updatedDiscount = discounts.find(
      (discount) => discount._id === discountId
    );

    if (updatedDiscount) {
      const code = updatedDiscount.code;
      const newStatus = !updatedDiscount.isActive;

      updateDiscount(code, { isActive: newStatus })
        .then(() => {
          setDiscounts(
            discounts.map((discount) =>
              discount._id === discountId
                ? { ...discount, isActive: newStatus }
                : discount
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
    }
  };

 

  const openModalForAdd = () => {
    setNewDiscount({
      code: "",
      description: "",
      discountValue: 0,
      expirationDate: "",
      startDate: "",
    });
    setCurrentDiscountId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (discount) => {
    // Đảm bảo expirationDate có định dạng đúng
    const expirationDate = discount.expirationDate
      ? new Date(discount.expirationDate).toISOString().split("T")[0] // Chuyển đổi thành YYYY-MM-DD
      : "";
      const startDate = discount.startDate
      ? new Date(discount.startDate).toISOString().split("T")[0] // Chuyển đổi thành YYYY-MM-DD
      : "";

    setNewDiscount({
      code: discount.code,
      description: discount.description,
      discountValue: discount.discountValue,
      expirationDate: expirationDate, // Sử dụng định dạng đúng cho ngày
      startDate: startDate,
    });
    setCurrentDiscountId(discount._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); 
  };
  
  return (
    <div className="discount-admin">
      <div className="discount-header">
        <h1>Quản Lý Mã Giảm Giá</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="discount-search"
          onChange={handleSearchChange}
        />
        <button onClick={openModalForAdd} className="add-discount-btn">
          <FaPlusCircle /> Thêm Mới Mã Giảm Giá
        </button>
      </div>

      <div className="discount-table">
        <table>
          <thead>
            <tr>
              <th>Mã Giảm Giá</th>
              <th>Mô Tả</th>
              <th>Giảm Giá</th>
              <th>Ngày Tạo</th>
              <th>Ngày Hết Hạn</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
                <tr key={discount._id}>
                  <td>{discount.code}</td>
                  <td>{discount.description}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(discount.discountValue)}
                  </td>

                  <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                  <td>
                    {new Date(discount.expirationDate).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="discount-actions">
                      <button
                        className="edit-btn-discount"
                        onClick={() => openModalForEdit(discount)}
                      >
                        <span className="icon-discount">
                          <FaEdit />
                        </span>
                      </button>
                      <button
                        className="delete-btn-discount"
                        onClick={() => handleDeleteDiscount(discount._id)}
                      >
                        <span className="icon-discount">
                          <FaTrashAlt />
                        </span>
                      </button>
                      <button
                        onClick={() => handleToggleActive(discount._id)}
                        className="active-btn-discount"
                      >
                        {discount.isActive ? (
                          <span className="icon-discount">
                            <FaLockOpen />
                          </span>
                        ) : (
                          <span className="icon-discount">
                            <FaLock />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
             }
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {isModalOpen && (
        <div className="modal-box-discount">
          <div className="modal-content-discount">
            <button className="close-btn-discount" onClick={closeModal}>
              x
            </button>
            <h2>
              {currentDiscountId
                ? "Cập Nhật Mã Giảm Giá"
                : "Thêm Mới Mã Giảm Giá"}
            </h2>
            <input
              type="text"
              placeholder="Mã Giảm Giá"
              value={newDiscount.code}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, code: e.target.value })
              }
              disabled={currentDiscountId !== null} // Disable if editing an existing discount
            />
            <textarea
              placeholder="Mô tả"
              value={newDiscount.description}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, description: e.target.value })
              }
              rows="4"
            />
            <label>Số tiền giảm:</label>
            <input
              type="number"
              placeholder="Giảm Giá (VND)"
              value={newDiscount.discountValue}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  discountValue: e.target.value,
                })
              }
            />
          <div className="modal-date">
          <div >
            <label>Ngày bắt đầu:</label>
            <input
            className="modal-dateStart"
              type="date"
              value={newDiscount.startDate}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  startDate: e.target.value,
                })
              }
            />
            </div>
            <div >
            <label>Ngày hết hạn:</label>
            <input
            className="modal-dateEnd"
              type="date"
              value={newDiscount.expirationDate}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  expirationDate: e.target.value,
                })
              }
            />
            </div> </div>

            <div className="modal-buttons">
              <button
                onClick={
                  currentDiscountId ? handleUpdateDiscount : handleAddDiscount
                }
                className="submit-btn-discount"
              >
                {currentDiscountId ? "Cập Nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DiscountManagement;
