import type React from "react";
import { Home, Bell, MessageSquare, Bookmark, User, LayoutDashboard, MoreHorizontal, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(localStorage.getItem("activeItem") || "Home");
    const [showMenu, setShowMenu] = useState(false);

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
        setActiveItem(label);
        localStorage.setItem("activeItem", label);
        navigate(path);
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-72 bg-[#1F1F1F] text-white p-3 flex flex-col justify-between border-r border-zinc-800">
            <div>
                <a href="/home" className="text-[#00FF7F] text-2xl font-bold">
                    PULSE
                </a>
                <nav className="mt-8 flex flex-col space-y-1">
                    <SidebarItem icon={<Home size={24} />} label="Home" active={activeItem === "Home"} navigate={() => handleNavigation("Home", "/home")} />
                    <SidebarItem icon={<Bell size={24} />} label="Notifications" active={activeItem === "Notifications"} navigate={() => handleNavigation("Notification", "/home/notifications")} />
                    <SidebarItem icon={<MessageSquare size={24} />} label="Messages" active={activeItem === "Messages"} navigate={() => handleNavigation("Messages", "/home/message")} />
                    <SidebarItem icon={<Bookmark size={24} />} label="Bookmarks" active={activeItem === "Bookmarks"} navigate={() => handleNavigation("Bookmarks", "/home/bookmarks")} />
                    <SidebarItem icon={<User size={24} />} label="My Profile" active={activeItem === "My Profile"} navigate={() => handleNavigation("My Profile", "/home/my-profile")} />
                    <SidebarItem icon={<LayoutDashboard size={24} />} label="Explore" active={activeItem === "Explore"} navigate={() => handleNavigation("Explore", "/home/explore")} />
                </nav>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2 p-3 pl-0 relative">
                    <img src="https://picsum.photos/200" alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex flex-col ml-1">
                        <span className="text-white font-semibold">200Lab Guest</span>
                        <span className="text-zinc-400 text-sm">@guest</span>
                    </div>
                    <button onClick={() => setShowMenu(!showMenu)} className="ml-auto text-zinc-400 hover:text-white relative cursor-pointer">
                        <MoreHorizontal size={20} />
                        {showMenu && (
                            <div className="absolute right-1/2 translate-x-1/2 bottom-[40px] w-16 flex flex-col items-center p-2 rounded-lg shadow-lg">
                                <button className="p-2 hover:text-white text-zinc-400 cursor-pointer" onClick={() => navigate("/home/setting")}><Settings size={20} /></button>
                                <button className="p-2 hover:text-white text-zinc-400 cursor-pointer" onClick={() => navigate("/")}><LogOut size={20} /></button>
                            </div>
                        )}
                    </button>
                </div>
                <button className="mt-4 bg-[#00FF7F] text-black font-semibold rounded-full py-3 px-6 cursor-pointer">
                    Post
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
            className={`flex items-center space-x-4 p-3 rounded-2xl w-full transition cursor-pointer 
                ${active ? "font-semibold bg-zinc-700" : "text-zinc-400 hover:bg-zinc-800"}`}
            onClick={navigate}
        >
            {icon}
            <span className="text-lg">{label}</span>
        </button>
    );
};

export default Sidebar;
