import { useState } from "react";
import { Users, FileText, ShieldCheck, Settings } from "lucide-react";
import AdminUsers from "./components/AdminUsers";
import AdminPosts from "./components/AdminPosts";
import AdminReports from "./components/AdminReports";
import AdminSystem from "./components/AdminSystem";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { key: "users", label: "Users", icon: <Users size={20} /> },
    { key: "posts", label: "Posts", icon: <FileText size={20} /> },
    { key: "reports", label: "Reports", icon: <ShieldCheck size={20} /> },
    { key: "system", label: "System", icon: <Settings size={20} /> },
  ];

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.key ? "bg-green-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-zinc-800 p-4 rounded-xl shadow-md">
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "posts" && <AdminPosts />}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "system" && <AdminSystem />}
      </div>
    </main>
  );
};

export default AdminPage;
