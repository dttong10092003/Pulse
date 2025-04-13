import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getTop10Users } from "../redux/slice/userSlice";
import { motion } from "framer-motion";

// 👇 Định nghĩa kiểu dữ liệu của User từ backend
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  avatar: string;
  username: string; // Đảm bảo có username
}

const RightSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("whoToFollow");
  const navigate = useNavigate();

  const userState = useSelector((state: RootState) => state.user);
  const top10Users = (userState as RootState["user"] & { top10Users: User[] }).top10Users;
  const authUser = useSelector((state: RootState) => state.auth?.user); // 👈 Lấy username từ auth
  const loading = userState.loading;
  const error = userState.error;
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // To store filtered users

  useEffect(() => {
    dispatch(getTop10Users()); // Fetch top 10 users
  }, [dispatch]);

  useEffect(() => {
    // Kiểm tra khi top10Users và authUser đã có dữ liệu
    if (top10Users.length > 0 && authUser?._id) {
      // Lọc user đang đăng nhập ra khỏi danh sách top 10
      const filtered = top10Users.filter((user: User) => user._id !== authUser._id); 
      setFilteredUsers(filtered); // Cập nhật filteredUsers để render lại giao diện
      console.log("Filtered users after filtering: ", filtered); // Debug: Kiểm tra dữ liệu sau khi lọc
    }
  }, [top10Users, authUser]); // Dependency array: lọc lại khi top10Users hoặc authUser thay đổi

  const handleUserClick = (userId: string) => {
    navigate(`/home/user-info/${userId}`);
  };

  return (
    <aside className="w-80 p-4 bg-[#1F1F1F] text-white border-l border-zinc-800">
      {/* Tabs */}
      <div className="flex justify-between mb-4 bg-[#191919] p-1 rounded-full relative">
        <div
          className={`absolute top-0 left-0 h-full w-1/2 bg-[#292929] rounded-full transition-all duration-300 ${
            activeTab === "trendingPosts" ? "translate-x-full" : "translate-x-0"
          }`}
        ></div>
        <button
          className={`relative px-3 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${
            activeTab === "whoToFollow" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("whoToFollow")}
        >
          Who to follow
        </button>
        <button
          className={`relative px-4 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${
            activeTab === "trendingPosts" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("trendingPosts")}
        >
          Trending posts
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "whoToFollow" && (
          loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => {
              const fullName = `${user.firstname} ${user.lastname}`;
              const avatar = user.avatar;

              // Kiểm tra xem user hiện tại có phải là user đăng nhập không
              const handle = user._id === authUser?._id
                ? ""  // Không hiển thị username cho user đang đăng nhập
                : `@${user.username}`;

              return (
                <div
                  key={user._id}
                  className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#333] transition"
                  onClick={() => handleUserClick(user._id)}
                >
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{fullName}</h4>
                    <p className="text-zinc-500 text-sm">
                      {handle || <span className="text-gray-500">No username</span>}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No users to follow</p>
          )
        )}

        {activeTab === "trendingPosts" && (
          <motion.div
            key="trendingPosts"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <p className="text-zinc-400">Coming soon...</p>
          </motion.div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;

