import React, { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminLoginPage.css';
import useAuth from '../hooks/useAuth'; 

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { username, setUsername, password, setPassword, role, handleRoleChange, handleFocus, handleLogin, errors } = useAuth(); // Sử dụng hook

    const adminRadioRef = useRef(null);

    useEffect(() => {
        toast.info("Chào mừng bạn đến với trang đăng nhập!");
        adminRadioRef.current.focus();
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); 
        }
    }, [navigate]);

    const onSubmit = async (e) => {
        const userRole = await handleLogin(e); // Gọi handleLogin và chờ phản hồi vai trò
        if (userRole) {
            navigate('/dashboard'); // Điều hướng tới dashboard
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
            <img src="https://static.vecteezy.com/system/resources/thumbnails/044/564/621/small_2x/watches-store-illustration-with-presentation-of-stylish-wristwatch-collection-various-models-analog-and-digital-in-flat-cartoon-background-vector.jpg" alt="Logo" className="logo" />
            <div className="login-container">
                <div className="form-container">
                    <h2>HỆ THỐNG QUẢN LÝ CỬA HÀNG ĐỒNG HỒ</h2>
                    <div className="role-selection">
                        <label>
                            <input
                                type="radio"
                                value="admin"
                                checked={role === 'admin'}
                                onChange={handleRoleChange}
                                required
                                ref={adminRadioRef}
                            />
                            Quản Lý
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="salesperson"
                                checked={role === 'salesperson'}
                                onChange={handleRoleChange}
                                required
                            />
                            Nhân Viên Sale
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="deliverystaff"
                                checked={role === 'deliverystaff'}
                                onChange={handleRoleChange}
                                required
                            />
                            Nhân Viên Giao Hàng
                        </label>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                                onFocus={() => handleFocus('username')}
                            />
                            {errors.username && <div className="error-message">{errors.username}</div>}
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                onFocus={() => handleFocus('password')}
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>
                        <button className="btnLogin" type="submit">Đăng Nhập</button>
                    </form>
                    <div className="forgot-password">
                        <span onClick={() => navigate('/forgotPassword')}>Quên mật khẩu?</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
