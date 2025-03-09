import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
    id: number;
    sender: string;
    avatar: string;
    message: string;
    createdAt: string;
    type: "like" | "reply" | "follow";
}

const mockNotifications: Notification[] = [
    { id: 1, sender: "hihihi hahaha", avatar: "https://picsum.photos/id/1/200/300", message: "liked your post", createdAt: "11 days ago", type: "like" },
    { id: 2, sender: "mewmew mewmew", avatar: "https://picsum.photos/id/2/200/300", message: "liked your post", createdAt: "23 days ago", type: "like" },
    { id: 3, sender: "Nguyen Tan", avatar: "https://picsum.photos/id/3/200/300", message: "liked your post", createdAt: "24 days ago", type: "like" },
    { id: 4, sender: "Tuấn Tt", avatar: "https://picsum.photos/id/4/200/300", message: "liked your post", createdAt: "a month ago", type: "like" },
    { id: 5, sender: "binh pham", avatar: "https://picsum.photos/id/5/200/300", message: "replied on your post", createdAt: "a month ago", type: "reply" },
    { id: 6, sender: "binh pham", avatar: "https://picsum.photos/id/6/200/300", message: "replied to your comment", createdAt: "a month ago", type: "reply" },
    { id: 7, sender: "Nguyen Tan", avatar: "https://picsum.photos/id/7/200/300", message: "followed you", createdAt: "24 days ago", type: "follow" }
];

const Notification: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<"all" | "like" | "reply" | "follow">("all");
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);

    useEffect(() => {
        if (filter === "all") {
            setFilteredNotifications(mockNotifications);
        } else {
            setFilteredNotifications(mockNotifications.filter(n => n.type === filter));
        }
    }, [filter]);

    const handleFilterChange = (type: "all" | "like" | "reply" | "follow") => {
        setFilter(type);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <main className="relative p-4 text-white h-screen overflow-hidden">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <button className="p-3 rounded-full text-white hover:bg-white/20 transition cursor-pointer" onClick={handleBack}>
                    <ArrowLeft size={28} />
                </button>
                <h1 className="text-2xl font-bold">Notifications</h1>
            </div>

            {/* Filter buttons */}
            <div className="mt-16 bg-zinc-900 p-4 rounded-lg shadow-lg flex items-center justify-between">
                <div className="flex gap-4">
                    <button 
                        onClick={() => handleFilterChange("all")}
                        className={`px-4 py-2 rounded-lg transition font-semibold focus:outline-none ${filter === "all" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 cursor-pointer"} z-10`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => handleFilterChange("like")}
                        className={`px-4 py-2 rounded-lg transition font-semibold focus:outline-none ${filter === "like" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 cursor-pointer"} z-10`}
                    >
                        Like
                    </button>
                    <button 
                        onClick={() => handleFilterChange("reply")}
                        className={`px-4 py-2 rounded-lg transition font-semibold focus:outline-none ${filter === "reply" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 cursor-pointer"} z-10`}
                    >
                        Reply
                    </button>
                    <button 
                        onClick={() => handleFilterChange("follow")}
                        className={`px-4 py-2 rounded-lg transition font-semibold focus:outline-none ${filter === "follow" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 cursor-pointer"} z-10`}
                    >
                        Follow
                    </button>
                </div>
                <button className="text-sm text-gray-300 hover:underline cursor-pointer">Read all</button>
            </div>

            {/* Notification list */}
            <div className="mt-4 overflow-y-auto h-full p-4 space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-zinc-800 flex items-center gap-4">
                            <img src={notification.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                            <div>
                                <p><strong>{notification.sender}</strong> {notification.message}</p>
                                <span className="text-sm text-gray-400">{notification.createdAt}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No notifications found</p>
                )}
            </div>
        </main>
    );
};

export default Notification;
