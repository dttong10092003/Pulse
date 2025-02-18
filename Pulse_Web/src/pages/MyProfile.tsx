import {Heart, MessageCircle, Bookmark, MoreHorizontal, Share2, MessageSquare, Users, UserRoundPen, CircleArrowLeft } from "lucide-react";

const MyProfile = ({ isDark }: { isDark: boolean }) => {
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
    ];

    return (
        <main className={`flex-1 ${isDark ? "bg-[#1F1F1F] text-white" : "bg-white text-black"}`}>
            {/* Header */}
            <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/200')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <button className={`absolute top-4 left-4 p-3 rounded-full transition ${isDark ? " text-white " : "text-white"}`} onClick={() => window.history.back()}>
                    <CircleArrowLeft size={28} />
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
                <div className={`mt-4 flex items-center justify-between w-full ${isDark ? "text-zinc-400" : "text-black font-semibold"}`}>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1"><MessageSquare size={18} /> {profileData.stats.posts} posts</span>
                        <span className="flex items-center gap-1"><Users size={18} /> {profileData.stats.followers} followers</span>
                        <span className="flex items-center gap-1"><Share2 size={18} /> {profileData.stats.status}</span>
                    </div>
                    <button className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-600">
                        <UserRoundPen size={18} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-zinc-800 mt-4">
                <button className="flex-1 py-4 text-center font-semibold">Posts</button>
                <button className="flex-1 py-4 text-center text-zinc-500">Featured</button>
                <button className="flex-1 py-4 text-center text-zinc-500">Media</button>
            </div>

            {/* Posts */}
            <div className="divide-zinc-800">
                {posts.map((post, index) => (
                    <PostCard key={index} {...post} user={profileData.username} isDark={isDark} />
                ))}
            </div>
        </main>
    );
};

const PostCard = ({
    user,
    content,
    time,
    likes,
    comments,
    isDark
}: {
    user: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
    isDark: boolean;
}) => {
    return (
        <div className={`p-4 ${isDark ? "hover:bg-zinc-900/50" : "hover:bg-gray-100/50 text-black"}`}>
            <div className="flex items-start gap-3">
                <img src="https://i.pravatar.cc/300" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user}</h3>
                            <span className="text-zinc-500">·</span>
                            <p className="text-zinc-500">{time}</p>
                        </div>
                        <button className="text-zinc-500">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className="mt-2">{content}</p>
                    <div className="flex items-center gap-6 mt-3">
                        <button className="flex items-center gap-2 text-zinc-500">
                            <Heart size={20} />
                            <span>{likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-zinc-500">
                            <MessageCircle size={20} />
                            <span>{comments}</span>
                        </button>
                        <button className="text-zinc-500">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
