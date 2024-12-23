import { useState } from 'react';
import React from 'react';
import { toast } from 'react-toastify';
import { loginAdmin } from "../services/authServicesAdmin";

const useAuth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(localStorage.getItem('role') || 'admin'); // Set mặc định là 'admin'

    const [errors, setErrors] = useState({ username: '', password: '', role: '' });

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setErrors({ ...errors, role: '' });
    };

    const handleFocus = (field) => {
        setErrors({ ...errors, [field]: '' });
    };

   const handleLogin = async (e) => {
    e.preventDefault();
    let formErrors = { username: '', password: '', role: '' };

    // Kiểm tra lỗi
    if (username.trim() === '') {
        formErrors.username = 'Tên đăng nhập không được để trống';
    } else if (username.length < 3) {
        formErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (password.trim() === '') {
        formErrors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
        formErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formErrors.username || formErrors.password || role === '') {
        setErrors(formErrors);
        return;
    }

    try {
        const response = await loginAdmin({ username, password, role });
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId);
        console.log(response);
        toast.success('Đăng nhập thành công!');
        return response.role;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);  
        } else if (error.message) {
            toast.error(error.message);  
        } else {
            toast.error('Đăng nhập không thành công!');  
        }
    }
    
    
};
    // Lấy vai trò từ localStorage khi khởi tạo
    React.useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole && storedRole !== role) {
          setRole(storedRole);
        }
      }, [role]);

    return {
        username,
        setUsername,
        password,
        setPassword,
        role,
        handleRoleChange,
        handleFocus,
        handleLogin,
        errors
    };
};

export default useAuth;
