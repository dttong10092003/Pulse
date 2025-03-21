import type React from "react";
import { Home, Bell, MessageSquare, Bookmark, User, LayoutDashboard, MoreHorizontal, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Columns2, ChevronRight } from "lucide-react";

const Sidebar = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(localStorage.getItem("activeItem") || "Home");
    const [showMenu, setShowMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Thêm state để kiểm tra hover vào sidebar

    useEffect(() => {
        const handleStorageChange = () => {
            setActiveItem(localStorage.getItem("activeItem") || "Home");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleNavigation = (label: string, path: string) => {
        setActiveItem(label); // Set the active item
        localStorage.setItem("activeItem", label); // Store in localStorage
        navigate(path); // Navigate to the correct path
    };

    const toggleSidebar = () => {
        setShowSidebar(prev => !prev); // Toggle trạng thái sidebar
    };

    return (
        <aside 
            className={`fixed top-0 left-0 h-screen ${showSidebar ? 'w-72' : 'w-20'} bg-[#1F1F1F] text-white p-3 flex flex-col justify-between border-r border-zinc-800 transition-all duration-300`}
            onMouseEnter={() => setIsHovered(true)} // Khi rê chuột vào sidebar
            onMouseLeave={() => setIsHovered(false)} // Khi rê chuột ra khỏi sidebar
        >
            <div>
                <a href="/home" className={`text-[#00FF7F] ${showSidebar ? 'text-3xl' : 'text-sm'} font-bold`}>
                    PULSE
                </a>
                <nav className="mt-8 flex flex-col space-y-1">
                    <SidebarItem icon={<Home size={24} />} label="Home" active={activeItem === "Home"} navigate={() => handleNavigation("Home", "/home")} showSidebar={showSidebar} />
                    <SidebarItem icon={<Bell size={24} />} label="Notifications" active={activeItem === "Notifications"} navigate={() => handleNavigation("Notifications", "/home/notifications")} showSidebar={showSidebar} />
                    <SidebarItem icon={<MessageSquare size={24} />} label="Messages" active={activeItem === "Messages"} navigate={() => handleNavigation("Messages", "/home/message")} showSidebar={showSidebar} />
                    <SidebarItem icon={<Bookmark size={24} />} label="Bookmarks" active={activeItem === "Bookmarks"} navigate={() => handleNavigation("Bookmarks", "/home/bookmarks")} showSidebar={showSidebar} />
                    <SidebarItem icon={<User size={24} />} label="My Profile" active={activeItem === "My Profile"} navigate={() => handleNavigation("My Profile", "/home/my-profile")} showSidebar={showSidebar} />
                    <SidebarItem icon={<LayoutDashboard size={24} />} label="Explore" active={activeItem === "Explore"} navigate={() => handleNavigation("Explore", "/home/explore")} showSidebar={showSidebar} />
                </nav>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2 p-3 pl-0 relative">
                    <img src="https://picsum.photos/200" alt="Profile" className="w-11 h-11 rounded-full object-cover ml-2" />
                    <div className={`flex flex-col ml-1 ${!showSidebar && 'hidden'}`}>
                        <span className="text-white font-semibold">200Lab Guest</span>
                        <span className="text-zinc-400 text-sm">@guest</span>
                    </div>
                    {/* Show three dots button only when sidebar is expanded */}
                    {showSidebar && (
                        <button onClick={() => setShowMenu(!showMenu)} className="ml-auto text-zinc-400 hover:text-white relative cursor-pointer">
                            <MoreHorizontal size={20} />
                            {showMenu && (
                                <div className="absolute right-1/2 translate-x-1/2 bottom-[40px] w-16 flex flex-col items-center p-2 rounded-lg shadow-lg">
                                    <button className="p-2 hover:text-white text-zinc-400 cursor-pointer" onClick={() => navigate("/home/setting")}><Settings size={20} /></button>
                                    <button className="p-2 hover:text-white text-zinc-400 cursor-pointer" onClick={() => navigate("/")}><LogOut size={20} /></button>
                                </div>
                            )}
                        </button>
                    )}
                </div>

                <button
                    className={`mt-4 bg-[#00FF7F] text-black font-semibold rounded-full py-3 px-4 cursor-pointer ${!showSidebar ? 'mx-auto py-2 px-4 text-sm' : ''}`}
                >
                    Post
                </button>
            </div>
            {/* Sidebar toggle button */}
            <button
                className={`cursor-pointer absolute top-4 right-1 text-lg transition duration-200 ${isHovered || showSidebar ? 'text-green-400' : 'text-white hover:text-gray-400'}`} 
                onClick={toggleSidebar}
            >
                {showSidebar ? <Columns2 size={20} /> : <ChevronRight size={20} />} {/* Change icon when sidebar is collapsed */}
            </button>
        </aside>
    );
};

const SidebarItem = ({
    icon,
    label,
    active,
    navigate,
    showSidebar
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    navigate: () => void;
    showSidebar: boolean;
}) => {
    return (
        <button
            className={`flex items-center space-x-4 p-3 rounded-2xl w-full transition cursor-pointer 
                ${active ? "font-semibold bg-zinc-700" : "text-zinc-400 hover:bg-zinc-800"}`}
            onClick={navigate}
        >
            {icon}
            {showSidebar && <span className="text-lg">{label}</span>} {/* Show label when sidebar is expanded */}
        </button>
    );
};

export default Sidebar;
