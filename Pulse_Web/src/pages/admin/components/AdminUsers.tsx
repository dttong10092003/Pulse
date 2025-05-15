import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../redux/slice/userSlice";
import { RootState, AppDispatch } from "../../../redux/store";

const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { top10Users, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (loading) return <p className="text-zinc-300">Loading users...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <div className="text-zinc-200 p-4">
      <h2 className="text-xl font-semibold mb-4">👥 All Users</h2>
      <ul className="space-y-2">
        {top10Users.map((user) => (
          <li key={user._id} className="border-b border-zinc-600 py-2">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <span>{user.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
