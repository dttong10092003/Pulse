import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import MyProfile from "./profile/MyProfile";
import RightSidebar from "../components/RightSidebar";
import Message from "./message/Message";
import EditProfile from "./profile/EditProfile";
import { Routes, Route, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  console.log(location.pathname);

  const isMessagePage = location.pathname === "/home/message";

  return (
    <div className={` bg-[#1F1F1F] text-white min-h-screen flex`}>
      <Sidebar />
      
      {/* Chỉ thay đổi phần nội dung chính */}
      <div className={`flex-1`}>
      <Routes>
        <Route path="/" element={<MainContent/>} />
        <Route path="/my-profile" element={<MyProfile  />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/message" element={<Message />} />
      </Routes>
      </div>
      {!isMessagePage && <RightSidebar />}
    </div>
  );
};

export default Home;
