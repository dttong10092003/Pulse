import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import MyProfile from "../pages/MyProfile";
import RightSidebar from "../components/RightSidebar";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`${isDark ? "bg-[#1F1F1F] text-white" : "bg-white text-black"} min-h-screen flex`}>
      <Sidebar isDark={isDark} setIsDark={setIsDark} />
      
      {/* Chỉ thay đổi phần nội dung chính */}
      <Routes>
        <Route path="/" element={<MainContent isDark={isDark} />} />
        <Route path="/my-profile" element={<MyProfile isDark={isDark} />} />
      </Routes>

      <RightSidebar isDark={isDark} />
    </div>
  );
};

export default Home;
