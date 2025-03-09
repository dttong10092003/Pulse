import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("whoToFollow");

  const usersToFollow = [
    { name: "Linh Võ", username: "tranlinhtt", avatar: "https://picsum.photos/200" },
    { name: "Anh Tuấn", username: "tuandha", avatar: "https://picsum.photos/200" },
    { name: "Do Quang Hop", username: "hicaunha", avatar: "https://picsum.photos/200" },
    { name: "CC 3M", username: "cc3m", avatar: "https://picsum.photos/200" },
    { name: "Ku Ku", username: "hxuan123", avatar: "https://picsum.photos/200" },
  ];

  const trendingPosts = [
    { title: "hello", time: "10 days ago", category: "Food", image: "https://picsum.photos/200/300" },
    { title: "vietnam", time: "11 days ago", category: "Photography", image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" },
    { title: "game", time: "a month ago", category: "Food", image: "https://picsum.photos/200/301" },
    { title: "this app's not real-time man??", time: "2 months ago", category: "Beauty", image: "https://picsum.photos/200/302" },
  ];

  return (
    <aside className="w-80 p-4 bg-[#1F1F1F] text-white border-l border-zinc-800">
      {/* Tabs */}
      <div className="flex justify-between mb-4 bg-[#191919] p-1 rounded-full relative" data-section="tabs">
        <div
          className={`absolute top-0 left-0 h-full w-1/2 bg-[#292929] rounded-full transition-all duration-300 ${activeTab === "trendingPosts" ? "translate-x-full" : "translate-x-0"}`}
          data-indicator="tab-indicator"
        ></div>
        <button 
          className={`relative px-3 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${activeTab === "whoToFollow" ? "font-bold" : "text-gray-400"}`} 
          onClick={() => setActiveTab("whoToFollow")}
          data-tab="whoToFollow"
        >
          Who to follow
        </button>
        <button 
          className={`relative px-4 py-1.5 w-1/2 font-semibold text-white transition cursor-pointer ${activeTab === "trendingPosts" ? "font-bold" : "text-gray-400"}`} 
          onClick={() => setActiveTab("trendingPosts")}
          data-tab="trendingPosts"
        >
          Trending posts
        </button>
      </div>
      
      {/* Content with Animation */}
      <AnimatePresence mode="wait">
        {activeTab === "whoToFollow" && (
          <motion.div 
            key="whoToFollow" 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
            data-section="whoToFollow"
          >
            {usersToFollow.map((user, index) => (
              <UserSuggestion key={index} {...user} />
            ))}
          </motion.div>
        )}
        
        {activeTab === "trendingPosts" && (
          <motion.div 
            key="trendingPosts" 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
            data-section="trendingPosts"
          >
            {trendingPosts.map((post, index) => (
              <TrendingPost key={index} {...post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

const UserSuggestion = ({
  name,
  username,
  avatar,
}: {
  name: string;
  username: string;
  avatar: string;
}) => {
  return (
    <div className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer" data-type="user-suggestion">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" data-user="avatar" />
      <div data-user="info">
        <h4 className="font-medium" data-user="name">{name}</h4>
        <p className="text-zinc-500 text-sm" data-user="username">@{username}</p>
      </div>
    </div>
  );
};

const TrendingPost = ({
  title,
  time,
  category,
  image,
}: {
  title: string;
  time: string;
  category: string;
  image: string;
}) => {
  return (
    <div className="bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer" data-type="trending-post">
      <img src={image} alt={title} className="w-16 h-16 rounded-full object-cover" data-post="image" />
      <div data-post="info">
        <h4 className="font-medium" data-post="title">{title}</h4>
        <p className="text-zinc-500 text-sm" data-post="time">{time} • <span className="text-white font-semibold" data-post="category">{category}</span></p>
      </div>
    </div>
  );
};

export default RightSidebar;
