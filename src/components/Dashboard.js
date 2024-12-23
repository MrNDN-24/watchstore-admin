import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProductManagement from './ProductManagement';
import CustomerManagement from './CustomerManagement';
import OrderAdminManagement from './OrderAdminManagement';
import UserManagement from './UserManagement';
import InventoryManagement from './InventoryManagement';
import Statistics from './StatisticsManagement';
import OrderDeliveryStaffManagement from './OrderDeliveryStaffManagement';
import BrandManagement from './BrandManagement';
import CategoryManagement from './CategoryManagement';
import StyleManagement from './StyleManagement';
import ImageManagement from './ImageManagement';
import DiscountManagement from './DiscountManagement';
import OrderSaleManagement from './OrderSaleManagement';
import OrderDetailManagement from './OrderDetailManagement';
import CustomerCare from './CustomerCare';
import ProfileManagement from './ProfileManagement';
import ActionProductManagement from './ActionProductManagement';
import TopProductManagement from './TopProductManagement';
import '../styles/Dashboard.css';



const Dashboard = () => {
 


    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content-container">
                <Routes>
                    <Route path="product-management" element={<ProductManagement />} />
                    <Route path="customer-management" element={<CustomerManagement />} />
                    <Route path="orderAdmin-management" element={<OrderAdminManagement />} />
                    <Route path="orderSale-management" element={<OrderSaleManagement/>}/>
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="inventory-management" element={<InventoryManagement />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="delivery-status" element={<OrderDeliveryStaffManagement />} />
                    <Route path="brand-management" element={<BrandManagement />} />
                    <Route path="category-management" element={<CategoryManagement/>} />
                    <Route path="style-management" element={<StyleManagement/>} />
                    <Route path="image-management/:productId" element={<ImageManagement />} />
                    <Route path="discount-management" element={<DiscountManagement/>} />
                    <Route path="orderdetail-management/:orderId" element={<OrderDetailManagement/>} />
                    <Route path="customer-care" element={<CustomerCare/>} />
                    <Route path="profile-management/:userId" element={<ProfileManagement/>} />
                    <Route path='action-product/:action/:productId?' element={<ActionProductManagement/>} />
                    <Route path="top-product" element={<TopProductManagement/>} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
