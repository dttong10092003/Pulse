import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  _id: string; // cần truyền ID bài viết để mở chi tiết
  mediaUrl?: string;
  isVideo?: boolean;
  title: string;
  user: string;
  avatar: string;
  category: string;
  likes: number;
  comments: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const hasMedia = !!post.mediaUrl;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/home/post/${post._id}`);
  };

  return (
    <div
      className="bg-zinc-900 p-3 rounded-lg flex flex-col justify-between min-h-[250px] shadow-md cursor-pointer hover:bg-zinc-800 transition"
      onClick={handleClick}
    >
      {hasMedia ? (
        post.isVideo ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        )
      ) : (
        <div className="flex items-center justify-center text-white text-center h-48 bg-zinc-800 rounded-lg mb-2 px-2">
          <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
        </div>
      )}

      {hasMedia && (
        <h3 className="mt-2 text-base font-semibold truncate">{post.title}</h3>
      )}

      <div className="flex items-center justify-between mt-2 text-zinc-400 text-sm">
        <div className="flex items-center gap-2">
          <img src={post.avatar} alt={post.user} className="w-6 h-6 rounded-full" />
          <span className="truncate">{post.user}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            post.category === "Beauty" ? "bg-pink-500" :
            post.category === "Food" ? "bg-yellow-400" :
            post.category === "Photography" ? "bg-blue-400" :
            post.category === "Travel" ? "bg-green-400" :
            "bg-gray-400"
          }`} />
          <span>{post.category}</span>
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 gap-4 text-sm text-zinc-400">
        <div className="flex items-center gap-1">
          <Heart size={16} className="text-red-500" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} className="text-blue-400" />
          <span>{post.comments}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
