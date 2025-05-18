import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../redux/slice/userSlice";
import { AppDispatch, RootState } from "../../../redux/store";

import UserDetailWithFilter from "./conponents_user/UserDetailWithFilter";
import UserStatsCard from "./conponents_user/UserStatsCard";
import UserList from "./conponents_user/UserList";
import UserTabs from "./conponents_user/UserTabs";

const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalCount, newUsersThisMonth, bannedCount, users } = useSelector((state: RootState) => state.adminUsers);

  const [activeTab, setActiveTab] = useState<"overview" | "topDetail">("overview");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users); // cập nhật lại khi có user mới
  }, [users]);

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="grid grid-cols-10 gap-4 w-full bg-gray-550 h-[calc(90vh-64px)] overflow-hidden">
      
      {/* Bên trái: tabs, stats, danh sách user */}
    <main className="col-span-7 flex flex-col h-full">
        <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "overview" ? (
          <>
            <div className="flex justify-between gap-4 my-4 px-2 px-24">
              <UserStatsCard title="Số lượng user" value={totalCount} />
              <UserStatsCard title={`User đăng ký tháng ${currentMonth}`} value={newUsersThisMonth} />
              <UserStatsCard title="User reported" value={bannedCount} />
            </div>

            <UserList users={filteredUsers} />
          </>
        ) : (
          <div className="text-white text-lg font-semibold px-6 py-8">
            Đây là phần Top Detail
          </div>
        )}
      </main>

      {/* Bên phải: khung lọc hoặc chi tiết user */}
      {activeTab === "overview" && (
        <section className="col-span-3 overflow-y-auto h-full">
          <UserDetailWithFilter
            originalUsers={users}
            setFilteredUsers={setFilteredUsers}
          />
        </section>
      )}
    </div>
  );
};

export default AdminUsers;
