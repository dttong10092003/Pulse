import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllUsers } from "../../../redux/slice/userSlice";
import { AppDispatch, RootState } from "../../../redux/store";

import UserDetailWithFilter from "./components_user/UserDetailWithFilter";
import UserStatsCard from "./components_user/UserStatsCard";
import UserList from "./components_user/UserList";
import UserTabs from "./components_user/UserTabs";
import TopDetail from "./components_user/TopDetail";
import MonthlyUserBarChart from "./components_user/MonthlyUserBarChart";
import { fetchAllUsers } from "../../../redux/slice/adminUserSlice";

const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalCount, newUsersThisMonth, bannedCount, users } = useSelector((state: RootState) => state.adminUsers);

  const [activeTab, setActiveTab] = useState<"overview" | "topDetail">("overview");
  const [filteredUsers, setFilteredUsers] = useState(users);


  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users); // cập nhật lại khi có user mới
  }, [users]);
  function getMonthName(monthNumber: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Trừ 1 vì mảng bắt đầu từ 0
    return monthNames[monthNumber - 1] || "Invalid month";
  }
  const currentMonth = new Date().getMonth() + 1;
const monthName = getMonthName(currentMonth);
  return (
    <div className="grid grid-cols-10 gap-4 w-full bg-gray-550 h-[calc(90vh-64px)] overflow-hidden">

      {/* Bên trái: tabs, stats, danh sách user */}
      <main className={`${activeTab === "overview" ? "col-span-7" : "col-span-10"} flex flex-col h-full overflow-y-auto`}>

        <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "overview" ? (
          <>
            <div className="flex justify-between gap-4 my-4 px-2 px-24">
              <UserStatsCard title="Total Users" value={totalCount} />
              <UserStatsCard title={`Users Registered in  ${monthName}`} value={newUsersThisMonth} />
              <UserStatsCard title="User reported" value={bannedCount} />
            </div>

            <UserList users={filteredUsers} />
          </>
        ) : (
          <div className="col-span-10 px-4">
            <TopDetail />
            <MonthlyUserBarChart />
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
