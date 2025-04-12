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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getTop10Users } from "../redux/slice/userSlice";
import { motion } from "framer-motion";

// 👇 Sửa lại interface cho đúng với dữ liệu từ backend
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  avatar: string;
}

const RightSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("whoToFollow");
  const navigate = useNavigate();

  const userState = useSelector((state: RootState) => state.user);
  const top10Users = (userState as RootState["user"] & { top10Users: User[] }).top10Users;
  const loading = userState.loading;
  const error = userState.error;

  useEffect(() => {
    dispatch(getTop10Users()).then((res) => {
      console.log("👀 top10Users response:", res);
    });
  }, [dispatch]);

  const handleUserClick = (userId: string) => {
    navigate(`/home/user-info/${userId}`);
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
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : top10Users && top10Users.length > 0 ? (
            top10Users.map((user: User) => (
              <UserSuggestion
                key={user._id}
                firstname={user.firstname}
                lastname={user.lastname}
                username={user.username}
                avatar={user.avatar}
                onClick={() => handleUserClick(user._id)}
              />
            ))
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
            {/* Render Trending posts here */}
          </motion.div>
        )}
      </div>
    </aside>
  );
};

// 👇 Component đã sửa để hiển thị fullname + avatar + username
const UserSuggestion = ({
  firstname,
  lastname,
  username,
  avatar,
  onClick,
}: {
  firstname: string;
  lastname: string;
  username: string;
  avatar: string;
  onClick: () => void;
}) => {
  const fullName = `${firstname} ${lastname}`;
  return (
    <div
      className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#333] transition"
      onClick={onClick}
    >
      <img src={avatar} alt={fullName} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <h4 className="font-medium">{fullName}</h4>
        <p className="text-zinc-500 text-sm">@{username}</p>
      </div>
    </div>
  );
};

export default RightSidebar;
