const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm đăng ký người dùng 
const registerUser = async (email, password, name) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const response = await axios.post('/api/users/register', {
      email,
      password,
      name
    });

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Hàm đăng nhập người dùng
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/users/login', {
      email,
      password
    });

    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Hàm đăng xuất
const logoutUser = () => {
  localStorage.removeItem('token');
};

// Kiểm tra trạng thái đăng nhập
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Lấy thông tin người dùng từ token
const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Decode JWT token để lấy thông tin user
    const decodedToken = jwt.decode(token);
    return decodedToken;
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin người dùng:", error);
    return null;
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentUser
}; 