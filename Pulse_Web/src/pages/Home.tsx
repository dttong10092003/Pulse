import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import MyProfile from "./profile/MyProfile";
import RightSidebar from "../components/RightSidebar";
import EditProfile from "./profile/EditProfile";
import { Routes, Route } from "react-router-dom";

const Home = () => {

  return (
    <div className={` bg-[#1F1F1F] text-white min-h-screen flex`}>
      <Sidebar />
      
      {/* Chỉ thay đổi phần nội dung chính */}
      <Routes>
        <Route path="/" element={<MainContent/>} />
        <Route path="/my-profile" element={<MyProfile  />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>

      <RightSidebar />
    </div>
  );
};

export default Home;
