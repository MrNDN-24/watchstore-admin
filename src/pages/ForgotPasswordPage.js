import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { forgotpasswordAdmin } from '../services/authServicesAdmin'; // Giả sử bạn đã có service này
import '../styles/AdminLoginPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(''); 
    const navigate = useNavigate();

    // Xử lý sự kiện khi người dùng nhập email
    const handleInputChange = (e) => {
        if (e.target.name === "email") {
            setErrorEmail(''); 
        }
        setEmail(e.target.value);
    };

    // Xử lý sự kiện khi người dùng gửi form
    const handleSubmitForgot = async (e) => {
        e.preventDefault();
        let hasError = false;

        // Kiểm tra định dạng email
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorEmail("Email không hợp lệ");
            hasError = true;
        }

        // Nếu có lỗi, không gửi yêu cầu
        if (hasError) return;

        try {
            // Gửi yêu cầu quên mật khẩu
            const data = await forgotpasswordAdmin(email);
            if (data.checksend === "Success") {
                toast.success("Kiểm tra email của bạn để nhận link đổi mật khẩu");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            const apiErrors = err.response?.data?.errors || {};
            if (typeof apiErrors === "string") {
                toast.error(apiErrors); // Hiển thị thông báo lỗi nếu có
            }
        }
    };

    return (
        <div className="login-page">
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick 
                pauseOnHover 
            />
            <img 
                src="https://static.vecteezy.com/system/resources/thumbnails/044/564/621/small_2x/watches-store-illustration-with-presentation-of-stylish-wristwatch-collection-various-models-analog-and-digital-in-flat-cartoon-background-vector.jpg" 
                alt="Logo" 
                className="logo" 
            />
            <div className="login-container">
                <div className="form-container">
                    <h2>Quên Mật Khẩu</h2>
                    <form onSubmit={handleSubmitForgot}>
                        <div>
                            <input
                                type="text"
                                placeholder="Nhập Email"
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errorEmail && <p className="error">{errorEmail}</p>} {/* Hiển thị lỗi email nếu có */}

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

export default ForgotPasswordPage;
