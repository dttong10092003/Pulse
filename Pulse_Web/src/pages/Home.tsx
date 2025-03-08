import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import MyProfile from "./profile/MyProfile";
import RightSidebar from "../components/RightSidebar";
import Message from "./message/Message";
import EditProfile from "./profile/EditProfile";
import Explore from "./explore/Explore";
import Setting from "./setting/AccountSettings";
import Notification from "./notification/Notification";
import { Routes, Route, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const isHiddenRightSidebar = location.pathname === "/home/message" || location.pathname === "/home/setting";

  return (
    <div className="flex bg-[#1F1F1F] text-white min-h-screen">
      {/* Sidebar cố định */}
      <Sidebar />

      <div className="flex-1 ml-72 overflow-auto">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/message" element={<Message />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </div>

      {/* Right Sidebar chỉ hiển thị nếu không phải trang Message */}
      {!isHiddenRightSidebar && <RightSidebar />}
      </div>
  );
};

export default Home;
