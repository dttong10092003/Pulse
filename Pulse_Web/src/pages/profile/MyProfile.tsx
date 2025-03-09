import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useState } from "react";

const MyProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Posts");
    const handleBack = () => {
        localStorage.setItem("activeItem", "Home"); // Cập nhật sidebar về Home
        window.dispatchEvent(new Event("storage")); // Phát sự kiện để Sidebar cập nhật lại
        navigate("/home"); // Chuyển hướng về trang Home
    };
    const profileData = {
        username: "200Lab Guest",
        handle: "@guest",
        bio: "Hello", // Thêm tiểu sử
        stats: {
            count: 453,
            posts: 170,
            followers: 8,
            status: "sad",
        },
    };

    const posts = [
        {
            content: "Xin chào",
            time: "2 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
        {
            content: "hello2",
            time: "5 days ago",
            likes: 1,
            comments: 0,
        },
    ];

    return (
        <main className="bg-[#1F1F1F] text-white">
            {/* Header */}
            <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/200')" }}>
                <div className="absolute inset-0 bg-black/50 " />
                <button className="absolute hover:bg-white/20 top-4 left-4 p-3 rounded-full transition text-white cursor-pointer" onClick={handleBack}>
                    <ArrowLeft size={28} />
                </button>
            </div>
            <div className="relative px-4 -mt-16 flex flex-col items-start">
                <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/300" alt="Avatar" className="w-24 h-24 rounded-full" />
                </div>
                <div className="mt-4">
                    <h2 className="text-2xl font-bold">{profileData.username}</h2>
                    <p className="text-zinc-500">{profileData.handle}</p>
                </div>
                <p className="text-zinc-400 mt-2">{profileData.bio}</p>
                <div className="mt-4 flex items-center justify-between w-full text-zinc-400">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1 cursor-pointer"><MessageSquare size={18} /> {profileData.stats.posts} posts</span>
                        <span className="flex items-center gap-1 cursor-pointer"><Users size={18} /> {profileData.stats.followers} followers</span>
                        <span className="flex items-center gap-1 cursor-pointer"><Share2 size={18} /> {profileData.stats.status}</span>
                    </div>
                    <button className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-600 cursor-pointer" onClick={() => navigate("/home/edit-profile")}>
                        <UserRoundPen size={18} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mt-4 bg-[#181818] p-1 rounded-full">
                <button
                    onClick={() => setActiveTab("Posts")}
                    className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Posts" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab("Featured")}
                    className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Featured" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                >
                    Featured
                </button>
                <button
                    onClick={() => setActiveTab("Media")}
                    className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Media" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                >
                    Media
                </button>
            </div>
            <div className="mt-4">
                {activeTab === "Posts" && <Posts posts={posts} username={profileData.username} />}
                {activeTab === "Featured" && <Featured />}
                {activeTab === "Media" && <Media />}
            </div>
        </main>
    );
};

export default MyProfile;