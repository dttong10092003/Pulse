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
        if (authReady) {
            if (!user?.isAdmin) {
                navigate("/home");
            }
        }
    }, [user, authReady, navigate]);

    if (!authReady) {
        return <div className="text-white p-10">Loading...</div>;
    }


    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <AdminPage />
        </div>
    );
};

export default AdminWrapper;
