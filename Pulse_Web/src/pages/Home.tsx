import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import RightSidebar from "../components/RightSidebar";
import { useState } from "react";

const Home = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`${isDark ? "bg-[#1F1F1F] text-white" : "bg-white text-black"} min-h-screen flex`}>
      <Sidebar isDark={isDark} setIsDark={setIsDark} />
      <MainContent isDark={isDark} />
      <RightSidebar isDark={isDark} />
    </div>
  );
};

export default Home;
