// import React, { useState} from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaChartBar, FaTags, FaBox, FaCogs, FaUsers, FaShippingFast, FaListAlt, FaAppleAlt, FaChevronDown, FaChevronUp,FaClipboardList, FaShoppingCart } from 'react-icons/fa'; 
// import Navbar from './Navbar'; 
// import useAuth from '../hooks/useAuth';
// import '../styles/Sidebar.css'; 

// const Sidebar = () => {
//     const { role } = useAuth();
  
//     const [isProductManagementOpen, setProductManagementOpen] = useState(false); 
//     const [isBarManagementOpen, setBarManagementOpen] = useState(false); 
//     const toggleProductManagement = () => {
//         setProductManagementOpen(!isProductManagementOpen);
//     };
//     const toggleBarManagement = () => {
//         setBarManagementOpen(!isBarManagementOpen);
//     };

   
//     return (
//         <div className="sidebar-container">
//             <Navbar /> {/* Navbar component */}
//             <div className="sidebar">
//                 <nav>
//                     <ul>
//                         {role === 'admin' && (
//                             <>
                                
//                                    {/* Quản lý báo cáo thống kê với menu con */}
//                                    <li>
//                                     <a 
//                                         href="#!" 
//                                         className="menu-toggle" 
//                                         onClick={toggleBarManagement}
//                                     >
//                                         <FaChartBar /> Báo cáo và thống kê
//                                         {isBarManagementOpen ? <FaChevronUp /> : <FaChevronDown />} 
//                                     </a>
//                                     {isBarManagementOpen && (
//                                         <ul className="submenu">
//                                         <li>
//                                             <NavLink to="/dashboard/statistics" className={({ isActive }) => isActive ? "active" : ""}>
//                                             <FaClipboardList /> Thống kê tổng quan
//                                             </NavLink>
//                                         </li>
//                                         <li>
//                                             <NavLink to="/dashboard/top-product" className={({ isActive }) => isActive ? "active" : ""}>
//                                             <FaShoppingCart /> Sản phẩm bán chạy
//                                             </NavLink>
//                                         </li>
//                                         </ul>
//                                     )}
//                                     </li>

//                                 {/* Quản lý sản phẩm với menu con */}
//                                 <li>
//                                     <a 
//                                         href="#!" 
//                                         className="menu-toggle" 
//                                         onClick={toggleProductManagement}
//                                     >
//                                         <FaBox /> Quản lý sản phẩm
//                                         {isProductManagementOpen ? <FaChevronUp /> : <FaChevronDown />} {/* Thêm icon mũi tên */}
//                                     </a>
//                                     {isProductManagementOpen && (
//                                         <ul className="submenu">
//                                             <li><NavLink to="/dashboard/brand-management" className={({ isActive }) => isActive ? "active" : ""}><FaAppleAlt /> Thương hiệu</NavLink></li>
//                                             <li><NavLink to="/dashboard/category-management" className={({ isActive }) => isActive ? "active" : ""}><FaTags /> Danh Mục</NavLink></li>
//                                             <li><NavLink to="/dashboard/product-management" className={({ isActive }) => isActive ? "active" : ""}><FaListAlt /> Sản Phẩm</NavLink></li>
//                                             <li><NavLink to="/dashboard/style-management" className={({ isActive }) => isActive ? "active" : ""}><FaCogs /> Phong Cách</NavLink></li>
//                                         </ul>
//                                     )}
//                                 </li>

//                                 <li><NavLink to="/dashboard/customer-management" className={({ isActive }) => isActive ? "active" : ""}><FaUsers /> Quản lý khách hàng</NavLink></li>
//                                 <li><NavLink to="/dashboard/orderAdmin-management" className={({ isActive }) => isActive ? "active" : ""}><FaBox /> Quản lý đơn hàng</NavLink></li>
//                                 <li><NavLink to="/dashboard/user-management" className={({ isActive }) => isActive ? "active" : ""}><FaUsers /> Quản lý nhân viên</NavLink></li>
                                
//                                 <li><NavLink to="/dashboard/discount-management" className={({ isActive }) => isActive ? "active" : ""}>< FaTags/>Quản lý khuyến mãi</NavLink></li>
//                             </>
//                         )}
//                         {role === 'salesperson' && (
//                             <>
//                                 <li><NavLink to="/dashboard/orderSale-management" className={({ isActive }) => isActive ? "active" : ""}><FaBox /> Quản lý đơn hàng</NavLink></li>
                               
//                             </>
//                         )}
//                         {role === 'deliverystaff' && (
//                             <li><NavLink to="/dashboard/delivery-status" className={({ isActive }) => isActive ? "active" : ""}><FaShippingFast /> Quản lý trạng thái giao hàng</NavLink></li>
//                         )}
//                     </ul>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChartBar, FaTags, FaBox, FaCogs, FaUsers, FaShippingFast, FaListAlt, FaAppleAlt, FaChevronDown, FaChevronUp, FaClipboardList, FaShoppingCart } from 'react-icons/fa'; 
import Navbar from './Navbar'; 
import useAuth from '../hooks/useAuth';
import '../styles/Sidebar.css'; 

const Sidebar = () => {
    const { role } = useAuth();
    const navigate = useNavigate(); // Hook để điều hướng
    const [isFirstRender, setIsFirstRender] = useState(true); // Trạng thái kiểm tra lần render đầu tiên
    const [isProductManagementOpen, setProductManagementOpen] = useState(false); 
    const [isBarManagementOpen, setBarManagementOpen] = useState(false); 
    
    const toggleProductManagement = () => {
        setProductManagementOpen(!isProductManagementOpen);
    };

    const toggleBarManagement = () => {
        setBarManagementOpen(!isBarManagementOpen);
    };

    useEffect(() => {
        if (role) { // Chỉ thực thi khi role đã được xác định
            if (isFirstRender) {
                if (role === 'admin') {
                    navigate('/dashboard/statistics'); // Điều hướng admin
                } else if (role === 'salesperson') {
                    navigate('/dashboard/orderSale-management'); // Điều hướng salesperson
                } else if (role === 'deliverystaff') {
                    navigate('/dashboard/delivery-status'); // Điều hướng deliverystaff
                }
                setIsFirstRender(false); // Ngăn không cho useEffect chạy lại
            }
        }
    }, [role, navigate, isFirstRender]);
    
    
    

    return (
        <div className="sidebar-container">
            <Navbar /> {/* Navbar component */}
            <div className="sidebar">
                <nav>
                    <ul>
                        {role === 'admin' && (
                            <>
                                <li>
                                    <a 
                                        href="#!" 
                                        className="menu-toggle" 
                                        onClick={toggleBarManagement}
                                    >
                                        <FaChartBar /> Báo cáo và thống kê
                                        {isBarManagementOpen ? <FaChevronUp /> : <FaChevronDown />} 
                                    </a>
                                    {isBarManagementOpen && (
                                        <ul className="submenu">
                                            <li>
                                                <NavLink to="/dashboard/statistics" className={({ isActive }) => isActive ? "active" : ""}>
                                                    <FaClipboardList /> Thống kê tổng quan
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/dashboard/top-product" className={({ isActive }) => isActive ? "active" : ""}>
                                                    <FaShoppingCart /> Sản phẩm bán chạy
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                                <li>
                                    <a 
                                        href="#!" 
                                        className="menu-toggle" 
                                        onClick={toggleProductManagement}
                                    >
                                        <FaBox /> Quản lý sản phẩm
                                        {isProductManagementOpen ? <FaChevronUp /> : <FaChevronDown />} 
                                    </a>
                                    {isProductManagementOpen && (
                                        <ul className="submenu">
                                            <li><NavLink to="/dashboard/brand-management" className={({ isActive }) => isActive ? "active" : ""}><FaAppleAlt /> Thương hiệu</NavLink></li>
                                            <li><NavLink to="/dashboard/category-management" className={({ isActive }) => isActive ? "active" : ""}><FaTags /> Danh Mục</NavLink></li>
                                            <li><NavLink to="/dashboard/product-management" className={({ isActive }) => isActive ? "active" : ""}><FaListAlt /> Sản Phẩm</NavLink></li>
                                            <li><NavLink to="/dashboard/style-management" className={({ isActive }) => isActive ? "active" : ""}><FaCogs /> Phong Cách</NavLink></li>
                                        </ul>
                                    )}
                                </li>
                                <li><NavLink to="/dashboard/customer-management" className={({ isActive }) => isActive ? "active" : ""}><FaUsers /> Quản lý khách hàng</NavLink></li>
                                <li><NavLink to="/dashboard/orderAdmin-management" className={({ isActive }) => isActive ? "active" : ""}><FaBox /> Quản lý đơn hàng</NavLink></li>
                                <li><NavLink to="/dashboard/user-management" className={({ isActive }) => isActive ? "active" : ""}><FaUsers /> Quản lý nhân viên</NavLink></li>
                                <li><NavLink to="/dashboard/discount-management" className={({ isActive }) => isActive ? "active" : ""}><FaTags /> Quản lý khuyến mãi</NavLink></li>
                            </>
                        )}
                        {role === 'salesperson' && (
                            <>
                                <li><NavLink to="/dashboard/orderSale-management" className={({ isActive }) => isActive ? "active" : ""}><FaBox /> Quản lý đơn hàng</NavLink></li>
                            </>
                        )}
                        {role === 'deliverystaff' && (
                            <li><NavLink to="/dashboard/delivery-status" className={({ isActive }) => isActive ? "active" : ""}><FaShippingFast /> Quản lý trạng thái giao hàng</NavLink></li>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
