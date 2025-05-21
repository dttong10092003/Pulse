import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { setSelectedUser } from "../../../../redux/slice/adminUserSlice";
import { User } from "../../../../redux/slice/adminUserSlice";
interface Props {
  users: User[];
}
const UserList = ({ users }: Props) => {
  // const { users } = useSelector((state: RootState) => state.adminUsers);
  const dispatch = useDispatch<AppDispatch>();

  return (
   <div className="bg-zinc-900 rounded-xl shadow-md flex-1 overflow-y-auto ">

      <h3 className="text-red-700 text-lg font-semibold text-center p-3">
        LISTS USERS
      </h3>

      <div className="overflow-y-auto max-h-[calc(80vh-280px)]">
        <table className="min-w-full text-sm text-zinc-300">
          <thead className="bg-zinc-900 text-xs text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-center text-white">STT</th>
              <th className="px-4 py-3 text-center text-white">Username</th>
              <th className="px-4 py-3 text-center text-white">Name</th>
              <th className="px-4 py-3 text-center text-white">Phone</th>
              <th className="px-4 py-3 text-center text-white">Email</th>
              <th className="px-4 py-3 text-center text-white">Date Created</th>
              <th className="px-4 py-3 text-center text-white">Report</th>
              <th className="px-4 py-3 text-center text-white">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="transition-colors duration-200 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => dispatch(setSelectedUser(user))}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 font-semibold text-indigo-300">{user.username}</td>
                  <td className="px-4 py-2">{user.fullName || "N/A"}</td>
                  <td className="px-4 py-2">{user.phone || "Chưa có"}</td>
                  <td className="px-4 py-2">{user.email || "Chưa có"}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-block min-w-[20px]">{user.isCountReport ?? 0}/3</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 whitespace-nowrap rounded-full text-xs font-bold shadow-md ${user.isActive
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      title={user.isActive ? " Active Accounts" : "Blocked Accounts"}
                    >
                      {user.isActive ? "Nomal" : "Blocked"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
