// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom"; // Thêm useNavigate

// const RightSidebar = () => {
//   const [activeTab, setActiveTab] = useState("whoToFollow");
//   const navigate = useNavigate(); // Khởi tạo navigate

//   const usersToFollow = [
//     { name: "Linh Võ", username: "tranlinhtt", avatar: "https://picsum.photos/200" },
//     { name: "Anh Tuấn", username: "tuandha", avatar: "https://picsum.photos/200" },
//     { name: "Do Quang Hop", username: "hicaunha", avatar: "https://picsum.photos/200" },
//     { name: "CC 3M", username: "cc3m", avatar: "https://picsum.photos/200" },
//     { name: "Ku Ku", username: "hxuan123", avatar: "https://picsum.photos/200" },
//   ];

//   const trendingPosts = [
//     { title: "hello", time: "10 days ago", category: "Food", image: "https://picsum.photos/200/300" },
//     { title: "vietnam", time: "11 days ago", category: "Photography", image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" },
//     { title: "game", time: "a month ago", category: "Food", image: "https://picsum.photos/200/301" },
//     { title: "this app's not real-time man??", time: "2 months ago", category: "Beauty", image: "https://picsum.photos/200/302" },
//   ];

//   const handleUserClick = () => {
//     navigate("/home/user-info"); // Điều hướng đến trang UserInfo_Follow mà không truyền dữ liệu
//   };  

//   return (
//     <aside className="w-80 p-4 bg-[#1F1F1F] text-white border-l border-zinc-800">
//       {/* Tabs */}
//       <div className="flex justify-between mb-4 bg-[#191919] p-1 rounded-full relative" data-section="tabs">
//         <div
//           className={`absolute top-0 left-0 h-full w-1/2 bg-[#292929] rounded-full transition-all duration-300 ${activeTab === "trendingPosts" ? "translate-x-full" : "translate-x-0"}`}
//           data-indicator="tab-indicator"
//         ></div>
//         <button 
//           className={`relative px-3 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${activeTab === "whoToFollow" ? "font-bold" : "text-gray-400"}`} 
//           onClick={() => setActiveTab("whoToFollow")}
//           data-tab="whoToFollow"
//         >
//           Who to follow
//         </button>
//         <button 
//           className={`relative px-4 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${activeTab === "trendingPosts" ? "font-bold" : "text-gray-400"}`} 
//           onClick={() => setActiveTab("trendingPosts")}
//           data-tab="trendingPosts"
//         >
//           Trending posts
//         </button>
//       </div>
      
//       {/* Content with Animation */}
//       <AnimatePresence mode="wait">
//         {activeTab === "whoToFollow" && (
//           <motion.div 
//             key="whoToFollow" 
//             initial={{ opacity: 0, x: -10 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             exit={{ opacity: 0, x: 10 }}
//             className="space-y-4"
//             data-section="whoToFollow"
//           >
//             {usersToFollow.map((user, index) => (
//               <UserSuggestion key={index} {...user} onClick={handleUserClick} /> 
//             ))}
//           </motion.div>
//         )}
        
//         {activeTab === "trendingPosts" && (
//           <motion.div 
//             key="trendingPosts" 
//             initial={{ opacity: 0, x: -10 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             exit={{ opacity: 0, x: 10 }}
//             className="space-y-4"
//             data-section="trendingPosts"
//           >
//             {trendingPosts.map((post, index) => (
//               <TrendingPost key={index} {...post} />
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </aside>
//   );
// };

// const UserSuggestion = ({
//   name,
//   username,
//   avatar,
//   onClick, // Thêm onClick để xử lý sự kiện
// }: {
//   name: string;
//   username: string;
//   avatar: string;
//   onClick: () => void; // onClick handler cho mỗi người dùng
// }) => {
//   return (
//     <div
//       className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer"
//       data-type="user-suggestion"
//       onClick={onClick} // Gọi onClick khi người dùng bấm vào
//     >
//       <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" />
//       <div>
//         <h4 className="font-medium">{name}</h4>
//         <p className="text-zinc-500 text-sm">@{username}</p>
//       </div>
//     </div>
//   );
// };

// const TrendingPost = ({
//   title,
//   time,
//   category,
//   image,
// }: {
//   title: string;
//   time: string;
//   category: string;
//   image: string;
// }) => {
//   return (
//     <div className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer" data-type="trending-post">
//       <img src={image} alt={title} className="w-16 h-16 rounded-full object-cover" data-post="image" />
//       <div data-post="info">
//         <h4 className="font-medium" data-post="title">{title}</h4>
//         <p className="text-zinc-500 text-sm" data-post="time">{time} • <span className="text-white font-semibold" data-post="category">{category}</span></p>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";  // Import useDispatch và useSelector
import { AppDispatch } from "../redux/store";  // Import AppDispatch
import { getTop10Users } from "../redux/slice/userSlice";  // Import thunk getTop10Users
import { RootState } from "../redux/store";  // Import RootState
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

// Define the type for the users
interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
}

const RightSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("whoToFollow");
  const navigate = useNavigate();

  // Lấy dữ liệu từ Redux store
  const { userDetails, loading, error } = useSelector((state: RootState) => state.user);

  // Fetch users when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");  // Lấy token từ localStorage
    if (!token) {
      console.log("Token không hợp lệ hoặc không có token.");
      navigate("/login"); // Điều hướng tới trang đăng nhập nếu không có token
      return;  // Nếu không có token, không thực hiện yêu cầu
    }

    try {
      // Kiểm tra thời gian hết hạn của token
      const decodedToken: { exp: number } = jwtDecode(token); // Giải mã token và lấy thời gian hết hạn
      const currentTime = Date.now() / 1000; // Thời gian hiện tại tính theo giây
      if (decodedToken.exp < currentTime) {
        console.log("Token đã hết hạn.");
        navigate("/login");  // Điều hướng tới trang đăng nhập nếu token hết hạn
        return;  // Nếu token hết hạn, không thực hiện yêu cầu
      }

      dispatch(getTop10Users());  // Gọi action getTop10Users khi component mount
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      navigate("/login"); // Điều hướng tới trang đăng nhập nếu token không hợp lệ
    }
  }, [dispatch, navigate]);

  const handleUserClick = (userId: string) => {
    navigate(`/home/user-info/${userId}`); // Điều hướng tới trang thông tin người dùng
  };

  return (
    <aside className="w-80 p-4 bg-[#1F1F1F] text-white border-l border-zinc-800">
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

      <div className="space-y-4">
        {activeTab === "whoToFollow" && (
          loading ? (
            <p>Loading...</p>  // Hiển thị khi đang tải
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>  // Hiển thị lỗi nếu có
          ) : (
            userDetails && userDetails.length > 0 ? (
              userDetails.map((user: User) => (
                <UserSuggestion key={user._id} {...user} onClick={() => handleUserClick(user._id)} />
              ))
            ) : (
              <p className="text-gray-500">No users to follow</p>  // Hiển thị khi không có người dùng
            )
          )
        )}

        {activeTab === "trendingPosts" && (
          <motion.div
            key="trendingPosts"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {/* Render Trending posts if any */}
          </motion.div>
        )}
      </div>
    </aside>
  );
};

const UserSuggestion = ({
  name,
  username,
  avatar,
  onClick,
}: {
  name: string;
  username: string;
  avatar: string;
  onClick: () => void;
}) => {
  return (
    <div className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-zinc-500 text-sm">@{username}</p>
      </div>
    </div>
  );
};

export default RightSidebar;


