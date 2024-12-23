import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordAdmin } from '../services/authServicesAdmin'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminLoginPage.css';

const ResetPasswordPage = () => {
  const { id, token } = useParams(); // Lấy id và token từ URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Xử lý sự kiện khi người dùng thay đổi giá trị trường mật khẩu
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Xử lý sự kiện khi người dùng thay đổi giá trị trường xác nhận mật khẩu
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Xử lý sự kiện khi người dùng gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      // Gửi yêu cầu reset mật khẩu đến server
      const data = await resetPasswordAdmin(id, token, password);
      if (data.status === 'Success') {
        toast.success('Mật khẩu đã được đặt lại thành công!');
        setTimeout(() => {
          navigate('/login'); // Chuyển hướng về trang đăng nhập
        }, 2000);
      }
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      if (typeof apiErrors === 'string') {
        toast.error(apiErrors);
      }
    }
  };

  useEffect(() => {
    toast.info('Vui lòng nhập mật khẩu mới của bạn!');
  }, []);

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <img src="https://static.vecteezy.com/system/resources/thumbnails/044/564/621/small_2x/watches-store-illustration-with-presentation-of-stylish-wristwatch-collection-various-models-analog-and-digital-in-flat-cartoon-background-vector.jpg" alt="Logo" className="logo" />
      <div className="login-container">
        <div className="form-container">
          <h2>Đặt Lại Mật Khẩu</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            {error && <p className="error">{error}</p>}

            <button className="btnLogin" type="submit">Xác nhận</button>
          </form>
          <div className="forgot-password">
            <span onClick={() => navigate('/login')}>Quay về trang đăng nhập!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
