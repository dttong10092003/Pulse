import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { logout } from "../../redux/slice/authSlice";
import { getUserProfile } from "../../redux/slice/authSlice";
import AdminUsers from "./components/AdminUsers";
import AdminPosts from "./components/AdminPosts";
import AdminReports from "./components/AdminReports";
import AdminSystem from "./components/AdminSystem";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const token = useSelector((state: RootState) => state.auth.token);

  const tabs = [
    { key: "users", label: "Users", icon: <Users size={18} /> },
    { key: "posts", label: "Posts", icon: <FileText size={18} /> },
    { key: "reports", label: "Reports", icon: <ShieldCheck size={18} /> },
    { key: "system", label: "System", icon: <Settings size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <AdminUsers />;
      case "posts":
        return <AdminPosts />;
      case "reports":
        return <AdminReports />;
      case "system":
        return <AdminSystem />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!userDetail && token) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch, token, userDetail]);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-75 bg-zinc-800 p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">ADMIN</h2>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-left cursor-pointer ${activeTab === tab.key
                    ? "bg-green-600 text-white"
                    : "hover:bg-zinc-700 text-zinc-300"
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom user info */}
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={userDetail?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-semibold text-sm truncate">
                {userDetail?.firstname || "Profile"} {userDetail?.lastname || ""}
              </span>
              <span className="text-zinc-400 text-xs truncate">
                @{userDetail?.username || "@"}
              </span>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <MoreHorizontal size={24} />
            </button>
            {showMenu && (
              <div className="absolute right-0 bottom-[45px] w-24 flex flex-col items-center p-2 rounded-xl bg-zinc-900 shadow-md z-50">
                <button
                  className="p-2 text-sm text-red-400 hover:text-red-300 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("activeItem");
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 bg-zinc-900">
        <h1 className="text-3xl font-bold mb-3 capitalize">
          {activeTab} Management
        </h1>
        <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
