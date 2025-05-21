// pages/admin/AdminWrapper.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import AdminPage from './AdminPage';

const AdminWrapper = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const authReady = useSelector((state: RootState) => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authReady) return; // Chưa có token thì chưa kiểm tra
        if (user === null || user === undefined) return; // Đợi user load xong
      
        if (!user?.isAdmin) {
          navigate("/home");
        }
      }, [user, authReady, navigate]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <AdminPage />
        </div>
    );
};

export default AdminWrapper;
