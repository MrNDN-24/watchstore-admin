import React, { useEffect, useState } from "react";
import {
  updateCustomerStatus,
  getAllCustomers,
  deleteCustomer,
} from "../services/customerServicesAdmin";
import { FaEye, FaLockOpen, FaLock, FaTrashAlt } from "react-icons/fa";
import "../styles/CustomerManagement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../components/Pagination";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);

  const [newCustomer, setNewCustomer] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    isActive: true,
    avatar: "",
    address_id: "", // Here we store the full address object
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Phân Trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const [search, setSearch] = useState("");
  useEffect(() => {
    getAllCustomers(currentPage, itemsPerPage, search)
      .then((data) => {
        setCustomers(data.customers);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  }, [currentPage, search]);

  const fetchData = (page) => {
    getAllCustomers(page, itemsPerPage)
      .then((data) => {
        console.log(data);
        setCustomers(data.customers);

        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách khách hàng:", error)
      );
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);
  // const handleDeleteCustomer = (customerId) => {
  //   const isConfirmed = window.confirm(
  //     "Bạn có chắc chắn muốn xóa khách hàng này?"
  //   );
  //   if (isConfirmed) {
  //     console.log(customerId);
  //     deleteCustomer(customerId)
  //       .then(() => {
  //         setCustomers(
  //           customers.filter((customer) => customer._id !== customerId)
  //         );
  //         toast.success("Khách hàng đã được xóa thành công!");
  //       })
  //       .catch((error) => {
  //         console.error("Lỗi khi xóa khách hàng:", error);
  //         toast.error("Lỗi xảy ra khi xóa khách hàng.");
  //       });
  //   }
  // };
  const handleDeleteCustomer = (customerId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa khách hàng này?"
    );
    if (isConfirmed) {
      deleteCustomer(customerId)
        .then(() => {
          // setCustomers(
          //   customers.filter((customer) => customer._id !== customerId)
          // );
          fetchData(currentPage);
          toast.success("Khách hàng đã được xóa thành công!");
        })
        .catch((error) => {
          console.error("Lỗi khi xóa khách hàng:", error);
          toast.error(
            error.response?.data?.message || "Lỗi xảy ra khi xóa khách hàng."
          );
        });
    }
  };

  // const handleToggleActive = (customerId) => {
  //   const updatedCustomer = customers.find(
  //     (customer) => customer._id === customerId
  //   );
  //   const newStatus = !updatedCustomer.isActive;

  //   updateCustomerStatus(customerId, newStatus)
  //     .then(() => {
  //       setCustomers(
  //         customers.map((customer) =>
  //           customer._id === customerId
  //             ? { ...customer, isActive: newStatus }
  //             : customer
  //         )
  //       );
  //       toast.success(
  //         `Trạng thái đã được ${
  //           newStatus ? "kích hoạt" : "vô hiệu hóa"
  //         } thành công!`
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi cập nhật trạng thái:", error);
  //       toast.error("Lỗi xảy ra khi cập nhật trạng thái.");
  //     });
  // };
  const handleToggleActive = (customerId) => {
    const updatedCustomer = customers.find(
      (customer) => customer._id === customerId
    );
    const newStatus = !updatedCustomer.isActive;

    updateCustomerStatus(customerId, newStatus)
      .then(() => {
        setCustomers(
          customers.map((customer) =>
            customer._id === customerId
              ? { ...customer, isActive: newStatus }
              : customer
          )
        );
        toast.success(
          `Trạng thái đã được ${
            newStatus ? "kích hoạt" : "vô hiệu hóa"
          } thành công!`
        );
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error(
          error.response?.data?.message || "Lỗi xảy ra khi cập nhật trạng thái."
        );
      });
  };

  // Open modal to view customer info, including address details
  const openModalForSeen = (customer) => {
    setNewCustomer({
      username: customer.username,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      isActive: customer.isActive,
      avatar: customer.avatar,
      address_id: customer.address_id, // Store the full address object
    });
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
    <div className="customer-admin">
      <div className="customer-header">
        <h1>Quản lý khách hàng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="customer-search"
          onChange={handleSearchChange}
        />
      </div>

      <div className="customer-table">
        <table>
          <thead>
            <tr>
              <th>CustomerID</th>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer._id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.isActive ? "Hoạt Động" : "Bị Khóa"}</td>
                <td>
                  <div className="customer-actions">
                    <button
                      className="seen-btn-customer"
                      onClick={() => openModalForSeen(customer)}
                    >
                      <span className="icon-customer">
                        <FaEye />
                      </span>
                    </button>
                    <button
                      className="delete-btn-customer"
                      onClick={() => handleDeleteCustomer(customer._id)}
                    >
                      <span className="icon-customer">
                        <FaTrashAlt />
                      </span>
                    </button>
                    <button
                      onClick={() => handleToggleActive(customer._id)}
                      className="active-btn-customer"
                    >
                      {customer.isActive ? (
                        <span className="icon-customer">
                          <FaLockOpen className="FaLockOpen" />
                        </span>
                      ) : (
                        <span className="icon-customer">
                          <FaLock className="FaLockOpen" />
                        </span>
                      )}
                    </button>
                    {/* <button
                        className={`status-btn ${
                          customer.isActive ? "active" : "inactive"
                        }`}
                        onClick={() => handleToggleActive(customer._id)}
                      >
                        {customer.isActive ? (
                          <span className="icon-customer">
                            
                            <FaLockOpen />
                          </span>
                        ) : (
                          <span className="icon-customer">
                            
                            <FaLock />
                          </span>
                        )}
                      </button> */}
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
        <div className="customer-modal">
          <div className="customer-modal-content">
            <h2>Thông tin khách hàng</h2>
            <button className="close-btn-customer" onClick={closeModal}>
              ×
            </button>

            <div className="customer-form-container">
              <div className="customer-container1">
                <div className="customer-form-group">
                  <div className="avatar-preview">
                    <img
                      src={newCustomer.avatar}
                      alt="Avatar"
                      className="avatar-preview-image"
                    />
                  </div>
                </div>

                <div className="customer-form-group">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    value={newCustomer.username}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        username: e.target.value,
                      })
                    }
                    disabled={true}
                  />
                </div>
                <div className="customer-form-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    disabled={true}
                  />
                </div>
                <div className="customer-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    disabled={true}
                  />
                </div>
              </div>
              <div className="customer-container2">
                <div className="customer-form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    disabled={true}
                  />
                </div>

                {newCustomer.address_id && (
                  <div className="customer-form-group">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={newCustomer.address_id.addressLine}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address_id: {
                            ...newCustomer.address_id,
                            addressLine: e.target.value,
                          },
                        })
                      }
                      disabled={true}
                    />
                  </div>
                )}

                {newCustomer.address_id && (
                  <div className="customer-form-group">
                    <label>Quận/Huyện</label>
                    <input
                      type="text"
                      value={newCustomer.address_id.district}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address_id: {
                            ...newCustomer.address_id,
                            district: e.target.value,
                          },
                        })
                      }
                      disabled={true}
                    />
                  </div>
                )}

                {newCustomer.address_id && (
                  <div className="customer-form-group">
                    <label>Phường/Xã</label>
                    <input
                      type="text"
                      value={newCustomer.address_id.ward}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address_id: {
                            ...newCustomer.address_id,
                            ward: e.target.value,
                          },
                        })
                      }
                      disabled={true}
                    />
                  </div>
                )}

                {newCustomer.address_id && (
                  <div className="customer-form-group">
                    <label>Thành phố</label>
                    <input
                      type="text"
                      value={newCustomer.address_id.city}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address_id: {
                            ...newCustomer.address_id,
                            city: e.target.value,
                          },
                        })
                      }
                      disabled={true}
                    />
                  </div>
                )}

                {newCustomer.address_id && (
                  <div className="customer-form-group">
                    <label>Mã bưu chính</label>
                    <input
                      type="text"
                      value={newCustomer.address_id.postalCode}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address_id: {
                            ...newCustomer.address_id,
                            postalCode: e.target.value,
                          },
                        })
                      }
                      disabled={true}
                    />
                  </div>
                )}

                <div className="customer-form-group">
                  <label>Trạng thái</label>
                  <select
                    value={newCustomer.isActive}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        isActive: e.target.value,
                      })
                    }
                    disabled={true}
                  >
                    <option value={true}>Hoạt Động</option>
                    <option value={false}>Bị Khóa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CustomerManagement;
