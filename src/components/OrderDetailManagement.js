import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails } from "../services/orderServicesAdmin";
import { getProductById } from "../services/productServicesAdmin";
import useAuth from "../hooks/useAuth";
import {
  FaArrowLeft,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import "../styles/OrderDetailManagement.css";

const OrderDetailManagement = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        const updatedProducts = await Promise.all(
          orderData.products.map(async (product) => {
            const { data } = await getProductById(product.product_id._id);
            const detailedProduct = data; // Sử dụng data từ API response
            return {
              ...product,
              product_id: detailedProduct,
            };
          })
        );
        setOrder({ ...orderData, products: updatedProducts });
      } catch (err) {
        setError("Không thể lấy thông tin đơn hàng hoặc sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const renderAddress = () => {
    if (order.customAddress) {
      return `${order.customAddress.addressLine}, ${order.customAddress.ward}, ${order.customAddress.district}, ${order.customAddress.city}`;
    } else if (order.address_id) {
      return `${order.address_id.addressLine}, ${order.address_id.ward}, ${order.address_id.district}, ${order.address_id.city}`;
    } else {
      return "Chưa có địa chỉ giao hàng";
    }
  };

  const handleGoBack = () => {
    if (role === "admin") {
      navigate("/dashboard/orderAdmin-management");
    } else if (role === "salesperson") {
      navigate("/dashboard/orderSale-management");
    } else if (role === "deliverystaff") {
      navigate("/dashboard/delivery-status");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <h2>Chi Tiết Đơn Hàng</h2>
        <button onClick={handleGoBack} className="order-back">
          <FaArrowLeft /> Quay Lại
        </button>
      </div>
      <div className="order-detail-container">
        <div className="order-products">
          <ul>
            {order.products.map((product) => {
              return (
                <li key={product.product_id._id} className="product-item">
                  <img
                    src={product.product_id.imageUrl || "default-image.jpg"}
                    alt={product.product_id.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">
                      <strong>{product.product_id.name}</strong>
                    </p>
                    <p>Giá: ${product.product_id.price}</p>
                    <p>Số lượng: {product.quantity}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="order-info">
          <h2>
            <FaInfoCircle /> Thông Tin Đơn Hàng
          </h2>
          <p>
            <strong>
              <FaMapMarkerAlt /> Địa chỉ giao hàng:
            </strong>{" "}
            {renderAddress()}
          </p>
          <p>
            <strong>
              <FaDollarSign /> Tổng tiền:
            </strong>{" "}
            ${order.total_price}
          </p>
          <p>
            <strong>
              <FaCreditCard /> Phương thức thanh toán:
            </strong>{" "}
            {order.payment_id.method}
          </p>
          <p>
            <strong>
              <FaCheckCircle /> Trạng thái thanh toán:
            </strong>{" "}
            {order.payment_id.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailManagement;
