import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userServicesAdmin";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";
import "../styles/UserManagement.css";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../components/Pagination";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "salesperson",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  
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
    getAllUsers(currentPage, itemsPerPage, search)
      .then((data) => {
        setUsers(data.users);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  }, [currentPage, search]);
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const fetchData = (page) => {
    getAllUsers(page, itemsPerPage)
      .then((data) => {
        console.log(data);
        setUsers(data.users);
     
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Lỗi khi lấy thương hiệu:", error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);
  const getRoleName = (role) => {
    const roleNames = {
      salesperson: "Nhân viên bán hàng",
      admin: "Quản trị viên",
      deliverystaff: "Nhân viên giao hàng"
    };
  
    return roleNames[role] || role; // Trả về tên hiển thị hoặc giá trị mặc định nếu không tìm thấy
  };
  
  const handleAddUser = async () => {
    const isDuplicate = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Email đã tồn tại!");
      return;
    }

    try {
      await createUser(newUser);
      fetchData(currentPage); 
      setIsModalOpen(false);
      toast.success("Thêm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng", error);
      toast.error("Dữ liệu không được để trống.");
    }
  };

  const handleUpdateUser = async () => {
    const isDuplicate = users.some(
      (user) =>
        user.email.toLowerCase() === newUser.email.toLowerCase() &&
        user._id !== currentUserId
    );

    if (isDuplicate) {
      toast.error("Email đã tồn tại!");
      return;
    }

    try {
      const updatedUser = { ...newUser };
      await updateUser(currentUserId, updatedUser);
      setUsers(
        users.map((user) =>
          user._id === currentUserId ? { ...user, ...updatedUser } : user
        )
      );
      setIsModalOpen(false);
      toast.success("Cập nhật người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng", error);
      toast.error("Dữ liệu không được để trống.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );
    if (isConfirmed) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng", error);
        toast.error("Lỗi xảy ra khi xóa người dùng.");
      }
    }
  };

  const handleToggleActive = (userId) => {
    const updatedUser = users.find((user) => user._id === userId);
    const newStatus = !updatedUser.isActive;

    updateUser(userId, { isActive: newStatus })
      .then(() => {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );
        toast.success(
          `Trạng thái đã được ${newStatus ? "kích hoạt" : "vô hiệu hóa"} thành công!`
        );
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        toast.error("Lỗi xảy ra khi cập nhật trạng thái.");
      });
  };



  const openModalForAdd = () => {
    setNewUser({
      username: "",
      name: "",
      email: "",
      phone: "",
      role: "customer",
    });
    setCurrentUserId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (user) => {
    setNewUser({
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setCurrentUserId(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="user-admin">
      <div className="user-header">
        <h1>Quản lý người dùng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="user-search"
          onChange={handleSearchChange}
        />
        <button onClick={openModalForAdd} className="add-user-btn">
          <FaPlusCircle /> Thêm người dùng mới
        </button>
      </div>

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Tên đăng nhập</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.userID}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{getRoleName(user.role)}</td>
                  <td>
                    <div className="user-actions">
                      <button
                        className="edit-btn-user"
                        onClick={() => openModalForEdit(user)}
                      >
                        <span className="icon-user">
                          <FaEdit />
                        </span>
                      </button>
                      <button
                        className="delete-btn-user"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <span className="icon-user">
                          <FaTrashAlt />
                        </span>
                      </button>
                      <button
                      onClick={() => handleToggleActive(user._id)}
                      className="active-btn-user"
                    >
                      {user.isActive ? (
                        <span className="icon-user">
                          <FaLockOpen className="FaLockOpen" />
                        </span>
                      ) : (
                        <span className="icon-user">
                          <FaLock className="FaLockOpen" />
                        </span>
                      )}
                    </button>
                      {/* <button
                        className={`status-btn ${
                          user.isActive ? "active" : "inactive"
                        }`}
                        onClick={() => handleToggleActive(user._id)}
                      >
                        {user.isActive ? (
                          <span className="icon-user">
                            <FaLockOpen />
                          </span>
                        ) : (
                          <span className="icon-user">
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
        <div className="user-modal">
          <div className="user-modal-content">
            <h2>{currentUserId ? "Cập nhật" : "Thêm mới người dùng"}</h2>
            <button className="close-btn-user" onClick={closeModal}>
              ×
            </button>
            
            <div className="user-form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                disabled={currentUserId ? true : false} 
              />
            </div>
            <div className="user-form-group">
              <label>Tên</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="user-form-group">
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="user-form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
            </div>
            <div className="user-form-group">
              <label>Vai trò</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
              
                <option value="deliverystaff">Nhân viên giao hàng</option>
                <option value="salesperson">Nhân viên bán hàng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
           
              <button
                onClick={currentUserId ? handleUpdateUser : handleAddUser}
                className="user-submit-btn"
              >
                {currentUserId ? "Cập nhật" : "Thêm mới"}
              </button>
    
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserManagement;
