import React, { useState, useEffect,useCallback } from "react";
import { getOrders, updateOrderStatus } from "../services/orderServicesAdmin";
import { getCustomerById } from "../services/customerServicesAdmin";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaShippingFast,
  FaRegCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import "../styles/OrderAdminManagement.css";
import Pagination from "../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
const OrderAdminManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("Chờ xử lý");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const goToOderDetailManagement = (orderId) => {
    console.log('Navigating to order details with ID:', orderId);
    navigate(`/dashboard/orderdetail-management/${orderId}`);
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4; 
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



  const fetchOrders = useCallback(async (page) => {
    try {
      const data = await getOrders(status, dateFilter, page, itemsPerPage); 
      const ordersWithUserDetails = await Promise.all(
        data.orders.map(async (order) => {
          const customerId = order.user_id; 
          const userData = await getCustomerById(customerId); 
          return {
            ...order,
            user_name: userData.name, 
          };
        })
      );
  
      setOrders(ordersWithUserDetails);
      setFilteredOrders(ordersWithUserDetails);
      setTotalPages(data.totalPages); 
      setCurrentPage(data.currentPage); 
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setLoading(false);
    }
  }, [status, dateFilter, itemsPerPage]); // Chỉ cập nhật lại fetchOrders khi status, dateFilter hoặc itemsPerPage thay đổi
  
  useEffect(() => {
    fetchOrders(currentPage); 
  }, [currentPage, fetchOrders]); // Chỉ cần fetchOrders và currentPage là dependencies
  
  

  const handleStatusChange = (status) => {
    setStatus(status);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}" không?`
    );
  
    if (isConfirmed) {
      try {
        await updateOrderStatus(orderId, newStatus);
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
        );
        fetchOrders(currentPage);
        setFilteredOrders(updatedOrders);
        toast.success(`Trạng thái đơn hàng đã được cập nhật thành "${newStatus}"!`);
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
      }
    }
  };
  

  const renderActionButtons = (order) => {
    switch (order.deliveryStatus) {
      case "Chờ xử lý":
        return (
          <div className="order-button-actions">
            <button
              className="order-confirm"
              onClick={() => handleUpdateStatus(order._id, "Đã xác nhận")}
            >
              <span className="icon-order">
                <FaRegCheckCircle />
              </span>
            </button>
            <button
              className="order-cancel"
              onClick={() => handleUpdateStatus(order._id, "Đã hủy")}
            >
              <span className="icon-order">
                <FaTimesCircle />
              </span>
            </button>
            <button className="order-details" onClick={() => goToOderDetailManagement(order._id)}>
              <span className="icon-order">
                <FaEye />
              </span>
            </button>
          </div>
        );
      case "Đã xác nhận":
        return (
          <div className="order-button-actions">
            <button
              className="order-shipping"
              onClick={() => handleUpdateStatus(order._id, "Đang vận chuyển")}
            >
              <span className="icon-order">
                <FaShippingFast />
              </span>
            </button>
            <button className="order-details" onClick={() => goToOderDetailManagement(order._id)}>
              <span className="icon-order">
                <FaEye />
              </span>
            </button>
          </div>
        );
      case "Đang vận chuyển":
        return (
          <div className="order-button-actions">
            <button
              className="order-complete"
              onClick={() => handleUpdateStatus(order._id, "Đã giao")}
            >
              <span className="icon-order">
                <FaCheck />
              </span>
            </button>
            <button className="order-details" onClick={() => goToOderDetailManagement(order._id)}>
              <span className="icon-order">
                <FaEye />
              </span>
            </button>
          </div>
        );
      case "Đã giao":
        return (
          <div className="order-button-actions">
            <button className="order-details" onClick={() => goToOderDetailManagement(order._id)}>
              <span className="icon-order">
                <FaEye />
              </span>
            </button>
          </div>
        );
      default:
        return (
          <div className="order-button-actions">
            <button className="order-details" onClick={() => goToOderDetailManagement(order._id)}>
              <span className="icon-order">
                <FaEye />
              </span>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="order-management-wrapper">
      <div className="order-header">
        <h1>Quản lý Đơn hàng</h1>
        <div className="order-status-filter">
          <div className="status-buttons">
            <button
              className={`status-btn ${status === "Chờ xử lý" ? "active" : ""}`}
              onClick={() => handleStatusChange("Chờ xử lý")}
            >
              Chờ xử lý
            </button>
            <button
              className={`status-btn ${status === "Đã xác nhận" ? "active" : ""}`}
              onClick={() => handleStatusChange("Đã xác nhận")}
            >
              Đã xác nhận
            </button>
            <button
              className={`status-btn ${status === "Đang vận chuyển" ? "active" : ""}`}
              onClick={() => handleStatusChange("Đang vận chuyển")}
            >
              Đang vận chuyển
            </button>
            <button
              className={`status-btn ${status === "Đã giao" ? "active" : ""}`}
              onClick={() => handleStatusChange("Đã giao")}
            >
              Đã giao
            </button>
            <button
              className={`status-btn ${status === "Đã hủy" ? "active" : ""}`}
              onClick={() => handleStatusChange("Đã hủy")}
            >
              Đã hủy
            </button>
          </div>
        </div>

        <div className="date-filter">
          <label>
            <input
              type="radio"
              name="dateFilter"
              value="today"
              checked={dateFilter === "today"}
              onChange={() => handleDateFilterChange("today")}
            />
            Hôm nay
          </label>
          <label>
            <input
              type="radio"
              name="dateFilter"
              value="all"
              checked={dateFilter === "all"}
              onChange={() => handleDateFilterChange("all")}
            />
            Tất cả
          </label>
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên Khách Hàng</th>
              <th>Trạng thái</th>
              <th>Tổng giá</th>
              <th>Ngày đặt hàng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Đang tải...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6">Không có đơn hàng</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.deliveryStatus}</td>
                  <td>{order.total_price.toLocaleString()} VND</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{renderActionButtons(order)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
       <ToastContainer />
    </div>
  );
};

export default OrderAdminManagement;
