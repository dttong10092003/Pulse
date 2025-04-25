// File: Posts.tsx
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageModal from "./ImageModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { deletePost, fetchUserPosts } from "../../../redux/slice/postProfileSlice";
import { likePost, unlikePost, fetchLikeCounts } from "../../../redux/slice/likeSlice";

dayjs.extend(relativeTime);

const timeAgo = (dateString: string): string => {
  const now = dayjs();
  const created = dayjs(dateString);
  const diffInSeconds = now.diff(created, "second");
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = now.diff(created, "minute");
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = now.diff(created, "hour");
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = now.diff(created, "day");
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = now.diff(created, "month");
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = now.diff(created, "year");
  return `${diffInYears}y ago`;
};

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  media?: string[];
  tags?: string[];
  username?: string;
  avatar?: string;
}

const Posts = ({ posts, username, avatar,commentCounts }: { posts: Post[]; username: string; avatar: string;commentCounts: Record<string, number>; }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (posts.length > 0) {
      const postIds = posts.map((p) => p._id);
      dispatch(fetchLikeCounts(postIds));
    }
  }, [posts]);

  return (
    <div className="divide-zinc-800">
      {posts.map((post, index) => (
        <PostCard
          key={index}
          postId={post._id}
          user={username}
          avatar={avatar}
          content={post.content}
          time={timeAgo(post.createdAt)}
          comments={commentCounts[post._id] || 0}
          media={post.media || []}
          tags={post.tags || []}
        />
      ))}
    </div>
  );
};

const PostCard = ({
  postId,
  user,
  avatar,
  content,
  time,
  comments,
  media,
  tags,
}: {
  postId: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  comments: number;
  media: string[];
  tags: string[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const likeCount = useSelector((state: RootState) => state.likes.likeCounts[postId] || 0);
  const likedPostIds = useSelector((state: RootState) => state.likes.likedPostIds);
  const isLiked = likedPostIds.includes(postId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeletePost = async () => {
    try {
      await dispatch(deletePost(postId)).unwrap();
      if (userId) await dispatch(fetchUserPosts(userId));
    } catch (err) {
      alert("Delete post failed: " + err);
    }
  };

  const handleToggleLike = () => {
    if (!userId) return;
    if (isLiked) {
      dispatch(unlikePost(postId));
    } else {
      dispatch(likePost(postId));
    }
  };

  return (
    <div className="p-4 hover:bg-zinc-900/50">
      <div className="flex items-start gap-3">
        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{user}</h3>
              <p className="text-xs text-zinc-500">{time}</p>
            </div>
            <div className="relative">
              <button className="text-zinc-500 cursor-pointer" onClick={() => setShowMenu((prev) => !prev)}>
                <MoreHorizontal size={20} />
              </button>
              {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-36 bg-zinc-800 shadow-lg rounded-lg z-50 py-2"
                >
                  <button className="flex justify-between items-center w-full px-4 py-2 hover:bg-zinc-700 text-white cursor-pointer">
                    Edit
                    <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 000-1.77l-2.98-2.98a1.25 1.25 0 00-1.77 0l-1.83 1.83 4.75 4.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button className="flex justify-between items-center w-full px-4 py-2 hover:bg-zinc-700 text-red-400 cursor-pointer" onClick={handleDeletePost}>
                    Delete
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zm3-9h2v7H9V10zm4 0h2v7h-2v-7zm5-5h-3.5l-1-1h-5l-1 1H5v2h14V5z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-2">{content}</p>

          {media.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-1 w-full rounded-xl overflow-hidden">
              {media.slice(0, 4).map((url, idx) => {
                const isLastVisible = idx === 3 && media.length > 4;
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                return (
                  <div key={idx} className="relative overflow-hidden">
                    {isVideo ? (
                      <video controls className="w-full h-[300px] object-cover" preload="metadata">
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={url} alt={`media-${idx}`} className="w-full h-[300px] object-cover" />
                    )}
                    {isLastVisible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                        +{media.length - 3}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-green-400">
              {tags.map((tag, i) => (
                <span key={i}>#{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 mt-3">
            <button
              className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-zinc-500"} cursor-pointer`}
              onClick={handleToggleLike}
            >
              <Heart size={20} />
              <span>{likeCount}</span>
            </button>

            <button
              className="flex items-center gap-2 text-zinc-500 cursor-pointer"
              onClick={() => {
                setStartIndex(0);
                setIsModalOpen(true);
              }}
            >
              <MessageCircle size={20} />
              <span>{comments}</span>
            </button>

            <button className="text-zinc-500 cursor-pointer">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mediaList={media}
          startIndex={startIndex}
          username={user}
          avatar={avatar}
          content={content}
          fullView
          postId={postId}
        />
      </div>
    </div>
  );
};

export default Posts;
