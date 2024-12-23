import React, { useState } from "react";
import { updatePassword } from "../services/userServicesAdmin"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProfileManagement.css";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng

const ChangePassword = ({ userId }) => {
     const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('role'); // Xóa role
    localStorage.removeItem('userId'); // Xóa userId
    navigate('/login'); // Điều hướng về trang đăng nhập
};


  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
  
    try {
      // Gửi đúng kiểu dữ liệu
      await updatePassword(userId, currentPassword, newPassword);
      toast.success("Mật khẩu đã được cập nhật thành công!");

 
      setTimeout(() => {
        handleLogout();
      }, 5000);

    } catch (err) {
      if (err.response && err.response.data) {
        // Hiển thị lỗi chi tiết từ server nếu có
        toast.error(err.response.data.error || "Có lỗi xảy ra khi thay đổi mật khẩu.");
      } else {
        toast.error("Có lỗi xảy ra khi thay đổi mật khẩu.");
      }
    }
  };

 
  return (
    <div className="change-password">
      <div className="input-password">
        <div>
          <label>Nhập mật khẩu hiện tại:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Nhập mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="password-actions">
        <button onClick={handlePasswordChange}>Thay đổi mật khẩu</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
