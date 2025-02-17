import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

const MainContent = ({ isDark }: { isDark: boolean }) => {
    const posts = [
        {
            user: "200Lab Guest",
            avatar: "https://picsum.photos/200",
            content: "tết",
            time: "1h ago",
            likes: 0,
            comments: 0,
        },
        {
            user: "200Lab Guest",
            avatar: "https://picsum.photos/200",
            content: "Hey ducle",
            time: "3h ago",
            likes: 1,
            comments: 0,
        },
        {
            user: "200Lab Guest",
            avatar: "https://picsum.photos/200",
            content: "Xin chào",
            time: "yesterday",
            likes: 1,
            comments: 0,
        },
        {
            user: "200Lab Guest",
            avatar: "https://picsum.photos/200",
            content: "hello2",
            time: "4 days ago",
            likes: 1,
            comments: 0,
        },
    ];

    return (
        <main className="flex-1">
        <div className="flex items-center gap-4 p-4">
            <img src="https://picsum.photos/200" alt="User avatar" className="w-10 h-10 rounded-full object-cover" />
            <input
                type="text"
                placeholder="Start a post..."
                className={`w-full bg-transparent text-lg placeholder:text-zinc-500 focus:outline-none ${isDark ? "text-zinc-200" : "text-black"}`}
            />
        </div>
        <div>
            {posts.map((post, index) => (
                <PostCard key={index} {...post} isDark={isDark} />
            ))}
        </div>
    </main>
    );
};

const PostCard = ({
    user,
    avatar,
    content,
    time,
    likes,
    comments,
    isDark,
}: {
    user: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
    isDark: boolean;
}) => {
    return (
        <div className={`p-4 hover:${isDark ? "bg-zinc-900/50" : "bg-gray-200/50"}`}>
            <div className="flex items-start gap-3">
                <img src={avatar || "/placeholder.svg"} alt={user} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user}</h3>
                            <span className={isDark ? "text-zinc-500" : "text-gray-600"}>·</span>
                            <p className={isDark ? "text-zinc-500" : "text-gray-600"}>{time}</p>
                        </div>
                        <button className={isDark ? "text-zinc-500 hover:text-zinc-300" : "text-gray-600 hover:text-gray-800"}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className={`mt-2 ${isDark ? "text-zinc-200" : "text-black"}`}>{content}</p>
                    <div className="flex items-center gap-6 mt-3">
                        <button className={isDark ? "text-zinc-500 hover:text-red-500" : "text-gray-600 hover:text-red-500"}>
                            <Heart size={20} />
                            <span>{likes}</span>
                        </button>
                        <button className={isDark ? "text-zinc-500 hover:text-zinc-300" : "text-gray-600 hover:text-gray-800"}>
                            <MessageCircle size={20} />
                            <span>{comments}</span>
                        </button>
                        <button className={isDark ? "text-zinc-500 hover:text-zinc-300" : "text-gray-600 hover:text-gray-800"}>
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
