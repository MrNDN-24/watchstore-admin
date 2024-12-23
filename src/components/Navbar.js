import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icon từ react-icons
import '../styles/Navbar.css'; // Import Navbar CSS

const Navbar = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token
        localStorage.removeItem('role'); // Xóa role
        localStorage.removeItem('userId'); // Xóa userId
        navigate('/login'); // Điều hướng về trang đăng nhập
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <h1>WatchThis</h1>
                <div className="navbar-links">
                    <Link to={`/dashboard/profile-management/${userId}`} className="navbar-link">
                        <FaUser /> Profile
                    </Link>
                    
                    {/* Sử dụng button thay cho Link cho nút Logout */}
                    <button onClick={handleLogout} className="navbar-link logout-btn">
                        <FaSignOutAlt /> Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
