import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useState, useEffect } from "react";
import { User } from "../../../../redux/slice/adminUserSlice";

interface Props {
  originalUsers: User[];
  setFilteredUsers: (users: User[]) => void;
}

const UserDetailWithFilter = ({ originalUsers, setFilteredUsers }: Props) => {
  const { selectedUser } = useSelector((state: RootState) => state.adminUsers);

  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reportFilter, setReportFilter] = useState("");
  const [mode, setMode] = useState<"detail" | "filter">(selectedUser ? "detail" : "filter");

  useEffect(() => {
    if (selectedUser) setMode("detail");
  }, [selectedUser]);

  useEffect(() => {
    let filtered = [...originalUsers];

    if (nameQuery)
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(nameQuery.toLowerCase())
      );

    if (phoneQuery)
      filtered = filtered.filter((u) =>
        u.phone.toLowerCase().includes(phoneQuery.toLowerCase())
      );

    if (statusFilter === "active") filtered = filtered.filter((u) => u.isActive);
    if (statusFilter === "inactive") filtered = filtered.filter((u) => !u.isActive);

    if (reportFilter === ">1") filtered = filtered.filter((u) => u.isCountReport > 1);
    if (reportFilter === ">2") filtered = filtered.filter((u) => u.isCountReport > 2);
    if (reportFilter === "=3") filtered = filtered.filter((u) => u.isCountReport === 3);

    setFilteredUsers(filtered);
  }, [nameQuery, phoneQuery, statusFilter, reportFilter]);

  const clearFilters = () => {
    setNameQuery("");
    setPhoneQuery("");
    setStatusFilter("");
    setReportFilter("");
    setFilteredUsers(originalUsers);
  };

  // KHÔNG cần sửa phần import & state — giữ nguyên
  // CHỈ sửa return ở dưới

  // ========== GIAO DIỆN LỌC ==========
  if (mode === "filter") {
    return (
      <div className="bg-zinc-600 h-full rounded-lg shadow-md p-6 text-white flex flex-col ">

        <h2 className="text-xl font-bold mb-6 text-center text-indigo-400">
          🔍 Bộ lọc người dùng
        </h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="🔠 Tìm theo tên"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="📱 Tìm theo số điện thoại"
            value={phoneQuery}
            onChange={(e) => setPhoneQuery(e.target.value)}
          />

          <div className="flex gap-3">
            <select
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">⚙️ Trạng thái</option>
              <option value="active">✅ Hoạt động</option>
              <option value="inactive">⛔ Bị khóa</option>
            </select>

            <select
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600"
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value)}
            >
              <option value="">🚨 Số report</option>
              <option value=">1">{`>`} 1</option>
              <option value=">2">{`>`} 2</option>
              <option value="=3">= 3</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold tracking-wide"
          >
            🧹 Xóa bộ lọc
          </button>
        </div>
      </div>
    );
  }

  // ========== GIAO DIỆN CHI TIẾT USER ==========
  return (
    <div className="bg-zinc-600 h-full rounded-lg shadow-md p-6 text-white flex flex-col justify-between">


      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-full mb-4">
          <img
            src={selectedUser?.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800"
          />
        </div>

        <h2 className="text-2xl font-bold mb-1">{selectedUser?.fullName}</h2>
        <p className="text-sm text-zinc-400 mb-6">@{selectedUser?.username}</p>

        <div className="w-full space-y-3 text-sm">
          <DetailItem label="📧 Email" value={selectedUser?.email || "Chưa cập nhật"} />
          <DetailItem label="📱 Số điện thoại" value={selectedUser?.phone || "Chưa cập nhật"} />
          <DetailItem label="🎂 Ngày sinh" value={formatDate(selectedUser?.dob)} />
          <DetailItem label="👤 Giới tính" value={selectedUser?.gender === "male" ? "Nam" : "Nữ"} />
          <DetailItem
            label="🟢 Trạng thái"
            value={
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${selectedUser?.isActive ? "bg-green-500" : "bg-red-500"
                  } text-white`}
              >
                {selectedUser?.isActive ? "Hoạt động" : "Bị khóa"}
              </span>
            }
          />
          <DetailItem label="🛡️ Vai trò" value={selectedUser?.isAdmin ? "Admin" : "Người dùng"} />
          <DetailItem
            label="🗓️ Ngày tạo"
            value={formatDate(selectedUser?.createdAt)}
          />
          <DetailItem
            label="🚨 Lượt báo cáo"
            value={selectedUser?.isCountReport ?? 0}
          />
        </div>

        <button
          onClick={() => setMode("filter")}
          className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold"
        >
          ← Quay về bộ lọc
        </button>
      </div>
    </div>
  );


};

const DetailItem = ({ label, value }: { label: string; value: string | number | JSX.Element }) => (
  <div className="flex justify-between border-b border-zinc-700 pb-1">
    <span className="text-zinc-400 font-medium">{label}</span>
    <span className="text-white">{value}</span>
  </div>
);

const formatDate = (dateString?: string) => {
  if (!dateString) return "Chưa cập nhật";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default UserDetailWithFilter;
