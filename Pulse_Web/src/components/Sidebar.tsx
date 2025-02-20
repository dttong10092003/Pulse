import type React from "react";
import { Home, Bell, MessageSquare, Bookmark, User, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(localStorage.getItem("activeItem") || "Home");
    // Theo dõi sự thay đổi của localStorage để cập nhật Sidebar
    useEffect(() => {
        const handleStorageChange = () => {
            setActiveItem(localStorage.getItem("activeItem") || "Home");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Hàm cập nhật trạng thái sidebar và lưu vào localStorage
    const handleNavigation = (label: string, path: string) => {
        setActiveItem(label);
        localStorage.setItem("activeItem", label); // Lưu trạng thái vào localStorage
        navigate(path);
    };



    return (
        <aside className={`w-72 p-6 flex flex-col border-zinc-800`}>
            <a href="/home" className={`text-[#00FF7F] text-2xl font-bold`}>
                PULSE
            </a>
            <nav className="mt-8 flex flex-col space-y-1">
                <SidebarItem icon={<Home size={24} />} label="Home" active={activeItem === "Home"} navigate={() => handleNavigation("Home", "/home")} />
                <SidebarItem icon={<Bell size={24} />} label="Notifications" active={activeItem === "Notifications"} navigate={() => handleNavigation("Notifications", "/notifications")} />
                <SidebarItem icon={<MessageSquare size={24} />} label="Messages" active={activeItem === "Messages"} navigate={() => handleNavigation("Messages", "/home/message")} />
                <SidebarItem icon={<Bookmark size={24} />} label="Bookmarks" active={activeItem === "Bookmarks"} navigate={() => handleNavigation("Bookmarks", "/bookmarks")} />
                <SidebarItem icon={<User size={24} />} label="My Profile" active={activeItem === "My Profile"} navigate={() => handleNavigation("My Profile", "/home/my-profile")} />
                <SidebarItem icon={<LayoutDashboard size={24} />} label="Explore" active={activeItem === "Explore"} navigate={() => handleNavigation("Explore", "/explore")} />
            </nav>
            <button className="mt-4 bg-[#00FF7F] text-black font-semibold rounded-full py-3 px-6">Post</button>

            {/* Toggle Button */}
            <div className="mt-4 flex items-center gap-2">
                {/* <span className={`${isDark ? "text-white" : "text-black"}`}>Dark Mode</span> */}
                {/* <button
                    // onClick={() => setIsDark(!isDark)}
                    className={`relative w-12 h-6 flex items-center rounded-full p-1 transition ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                >
                    <div
                        className={`w-5 h-5 rounded-full shadow-md transform transition ${isDark ? "translate-x-6 bg-black" : "translate-x-0 bg-white"}`}
                    ></div>
                </button> */}

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

const SidebarItem = ({
    icon,
    label,
    active,
    navigate
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    navigate: () => void;
}) => {
    return (
        <button
            className={`flex items-center space-x-4 p-3 rounded-lg w-full transition 
                ${active ? "font-semibold" : "text-zinc-400 hover:bg-zinc-800"}`}
            onClick={navigate}
        >
            {icon}
            <span className="text-lg">{label}</span>
        </button>
    );
};

export default Sidebar;
