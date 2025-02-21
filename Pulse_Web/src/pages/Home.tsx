import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import MyProfile from "./profile/MyProfile";
import RightSidebar from "../components/RightSidebar";
import Message from "./message/Message";
import EditProfile from "./profile/EditProfile";
import Explore from "./explore/Explore";
import { Routes, Route, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const isMessagePage = location.pathname === "/home/message";

  return (
    <div className="flex bg-[#1F1F1F] text-white min-h-screen">
      {/* Sidebar cố định */}
      <Sidebar />

      {/* Nội dung chính, tránh bị che bằng `ml-72` */}
      <div className="flex-1 ml-72 overflow-auto p-6">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/message" element={<Message />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </div>

      {/* Right Sidebar chỉ hiển thị nếu không phải trang Message */}
      {!isMessagePage && <RightSidebar />}
    </div>
  );
};

export default Home;
