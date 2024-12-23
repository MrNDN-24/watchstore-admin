import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, updateUserById } from "../services/userServicesAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProfileManagement.css";
import ChangePassword from "../components/ChangePassword";

const ProfileManagement = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false); // Trạng thái ẩn/hiện ChangePassword
  const [isChangePasswordActive, setIsChangePasswordActive] = useState(false); // Track if ChangePassword is active

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData.user);
        setNewUser(userData.user); // Set initial data for editing
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast.error("Tên, email và số điện thoại không được để trống!");
      return;
    }
    const formData = new FormData();
    formData.append("name", newUser.name);
    formData.append("email", newUser.email);
    formData.append("phone", newUser.phone);
    if (newUser.avatar) {
      formData.append("avatar", newUser.avatar);
    }

    try {
      setUpdating(true);
      await updateUserById(userId, formData);
      setUser({
        ...newUser,
        avatar: newUser.avatar ? URL.createObjectURL(newUser.avatar) : user.avatar,
      });
      setIsEditing(false);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      setError("Lỗi trong quá trình cập nhật");
      toast.error("Lỗi trong quá trình cập nhật");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, avatar: file });
      const objectUrl = URL.createObjectURL(file);
      setUser({ ...user, avatar: objectUrl });
    }
  };

  const toggleChangePassword = () => {
    setIsChangePasswordVisible(!isChangePasswordVisible);
    setIsChangePasswordActive(!isChangePasswordActive); 
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h1>Thông tin cá nhân</h1>
      <div className="profile-info">
        <div className="avatar">
          <img
            src={user.avatar || "/default-avatar.jpg"}
            alt="Avatar"
            width={100}
            onClick={handleAvatarClick}
          />
          {isEditing && (
            <input
              id="avatarInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          )}
        </div>
        <div className="user-details">
          <div>
            <strong>Tên:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            ) : (
              user.name
            )}
          </div>
          <div>
            <strong>Email:</strong>{" "}
            {isEditing ? (
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            ) : (
              user.email
            )}
          </div>
          <div>
            <strong>Số điện thoại:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            ) : (
              user.phone
            )}
          </div>
        </div>
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} disabled={updating}>
              {updating ? "Đang cập nhật..." : "Lưu"}
            </button>
            <button onClick={() => setIsEditing(false)}>Hủy</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} disabled={isChangePasswordActive}>
            Chỉnh sửa
          </button>
        )}
        <button onClick={toggleChangePassword} disabled={isEditing}>
          {isChangePasswordVisible ? "Ẩn Đổi Mật Khẩu" : "Đổi Mật Khẩu"}
        </button>
      </div>
      <div className="change-password-section">
        {isChangePasswordVisible && <ChangePassword userId={userId} />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileManagement;