// pages/admin/AdminWrapper.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import AdminPage from './AdminPage';

const AdminWrapper = () => {
    const user = useSelector((state: RootState) => state.auth.user); // ✅ Lấy từ auth-service
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/home'); // ❌ Không phải admin thì đẩy về home
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <AdminPage />
        </div>
    );
};

export default AdminWrapper;
