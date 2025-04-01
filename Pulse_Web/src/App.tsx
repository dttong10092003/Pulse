import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners'; // Import spinner từ react-spinners
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import UserInfo from './pages/userInfo/UserInfo'; // Trang UserInfo

import UserInfo from './pages/userInfo/UserInfo';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './App.css';

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  useEffect(() => {
    setLoading(true); // Khi thay đổi location thì bắt đầu loading
    const timeout = setTimeout(() => setLoading(false), 120); // Giả lập thời gian loading 120ms
    return () => clearTimeout(timeout); // Dọn dẹp khi unmount
  }, [location]);

  return (
    <Provider store={store}>
      {loading && (
        <div className="loading-overlay">
          {/* Hiển thị spinner khi đang loading */}
          <ClipLoader size={50} color="#00FF7F" loading={loading} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userinfo" element={<UserInfo />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home/*" element={<Home />} /> {/* thêm để quản lý các route con */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Provider>
  );
};

export default App;
