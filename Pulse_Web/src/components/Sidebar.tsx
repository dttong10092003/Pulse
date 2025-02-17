import type React from "react";
import { Home, Bell, MessageSquare, Bookmark, User, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const navigate = useNavigate();
    return (
        <aside className={`w-72 p-6 flex flex-col ${isDark ? "border-zinc-800" : "border-black"}`}>
            <a href="/" className={`${isDark ? "text-[#00FF7F]" : "text-black"} text-2xl font-bold`}>
                PULSE
            </a>
            <nav className="mt-8 flex flex-col space-y-1">
                <SidebarItem icon={<Home size={24} />} label="Home" active isDark={isDark} />
                <SidebarItem icon={<Bell size={24} />} label="Notifications" isDark={isDark} />
                <SidebarItem icon={<MessageSquare size={24} />} label="Messages" isDark={isDark} />
                <SidebarItem icon={<Bookmark size={24} />} label="Bookmarks" isDark={isDark} />
                <SidebarItem icon={<User size={24} />} label="My Profile" isDark={isDark} />
                <SidebarItem icon={<LayoutDashboard size={24} />} label="Explore" isDark={isDark} />
            </nav>
            <button className="mt-4 bg-[#00FF7F] text-black font-semibold rounded-full py-3 px-6">Post</button>

            {/* Toggle Button */}
            <div className="mt-4 flex items-center gap-2">
                <span className={`${isDark ? "text-white" : "text-black"}`}>Dark Mode</span>
                <button
                    onClick={() => setIsDark(!isDark)}
                    className={`relative w-12 h-6 flex items-center rounded-full p-1 transition ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
                >
                    <div
                        className={`w-5 h-5 rounded-full shadow-md transform transition ${isDark ? "translate-x-6 bg-black" : "translate-x-0 bg-white"}`}
                    ></div>
                </button>

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
    isDark
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    isDark: boolean;
}) => {
    return (
        <button
        className={`flex items-center space-x-4 p-3 rounded-lg w-full transition
    ${active ? "font-semibold" : isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-black hover:bg-gray-300"}`}
    >
        {icon}
        <span className="text-lg">{label}</span>
    </button>
    );
};

export default Sidebar;
