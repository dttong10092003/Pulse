import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners'; // Import spinner từ react-spinners
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import './App.css';

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  useEffect(() => {
    setLoading(true); // Khi thay đổi location thì bắt đầu loading
    const timeout = setTimeout(() => setLoading(false), 500); // Giả lập thời gian loading 500ms
    return () => clearTimeout(timeout); // Dọn dẹp khi unmount
  }, [location]);

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          {/* Hiển thị spinner khi đang loading */}
          <ClipLoader size={50} color="#00FF7F" loading={loading} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/*" element={<Home />} /> {/* thêm để quản lý các route con */}
      </Routes>
    </>
  );
}

export default App;
