import { useState, useEffect } from "react";
import { User } from "../../../../redux/slice/adminUserSlice";

interface Props {
  originalUsers: User[];
  setFilteredUsers: (users: User[]) => void;
  onClose: () => void;
}

const UserFilterModal = ({ originalUsers, setFilteredUsers, onClose }: Props) => {
  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // '', 'active', 'inactive'
  const [reportFilter, setReportFilter] = useState(""); // '', '>1', '>2', '=3'

  useEffect(() => {
    let filtered = [...originalUsers];

    if (nameQuery) {
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(nameQuery.toLowerCase())
      );
    }

    if (phoneQuery) {
      filtered = filtered.filter((u) =>
        u.phone.toLowerCase().includes(phoneQuery.toLowerCase())
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((u) => u.isActive === true);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((u) => u.isActive === false);
    }

    if (reportFilter === ">1") {
      filtered = filtered.filter((u) => u.isCountReport > 1);
    } else if (reportFilter === ">2") {
      filtered = filtered.filter((u) => u.isCountReport > 2);
    } else if (reportFilter === "=3") {
      filtered = filtered.filter((u) => u.isCountReport === 3);
    }

    setFilteredUsers(filtered);
  }, [nameQuery, phoneQuery, statusFilter, reportFilter]);

  const clearFilters = () => {
    setNameQuery("");
    setPhoneQuery("");
    setStatusFilter("");
    setReportFilter("");
    setFilteredUsers(originalUsers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-[90%] max-w-md text-white">
        <h2 className="text-lg font-bold mb-4 text-center">Bộ lọc người dùng</h2>

        <input
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-700 text-white"
          placeholder="Tìm theo tên"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />

        <input
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-700 text-white"
          placeholder="Tìm theo số điện thoại"
          value={phoneQuery}
          onChange={(e) => setPhoneQuery(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <select
            className="flex-1 px-3 py-2 rounded bg-zinc-700 text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Bị khóa</option>
          </select>

          <select
            className="flex-1 px-3 py-2 rounded bg-zinc-700 text-white"
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
          >
            <option value="">Số report</option>
            <option value=">1">{'>'} 1</option>
            <option value=">2">{'>'} 2</option>
            <option value="=3">= 3</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilterModal;
