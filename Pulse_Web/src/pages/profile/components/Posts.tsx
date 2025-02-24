import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

const Posts = ({ posts, username }: { posts: any[]; username: string }) => {
    return (
        <div className="divide-zinc-800">
            {posts.map((post, index) => (
                <PostCard key={index} {...post} user={username} />
            ))}
        </div>
    );
};

const PostCard = ({
    user,
    content,
    time,
    likes,
    comments,
}: {
    user: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
}) => {
    return (
        <div className="p-4 hover:bg-zinc-900/50">
            <div className="flex items-start gap-3">
                <img src="https://i.pravatar.cc/300" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user}</h3>
                            <p className="text-xs text-zinc-500">{time}</p>
                        </div>
                        <button className="text-zinc-500 cursor-pointer">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className="mt-2">{content}</p>
                    <div className="flex items-center gap-6 mt-3">
                        <button className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                            <Heart size={20} />
                            <span>{likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                            <MessageCircle size={20} />
                            <span>{comments}</span>
                        </button>
                        <button className="text-zinc-500 cursor-pointer">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;