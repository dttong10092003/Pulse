// File: Posts.tsx
import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageModal from "./ImageModal";

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

const Posts = ({ posts, username, avatar }: { posts: any[]; username: string; avatar: string }) => {
  return (
    <div className="divide-zinc-800">
      {posts.map((post, index) => (
        <PostCard
          key={index}
          user={username}
          avatar={avatar}
          content={post.content}
          time={timeAgo(post.createdAt)}
          likes={post.likes ?? 0}
          comments={post.comments ?? 0}
          media={post.media || []}
          tags={post.tags || []}
        />
      ))}
    </div>
  );
};

const PostCard = ({
  user,
  avatar,
  content,
  time,
  likes,
  comments,
  media,
  tags,
}: {
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  media: string[];
  tags: string[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

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
            <button className="text-zinc-500 cursor-pointer">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <p className="mt-2">{content}</p>

          {media.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-1 w-full rounded-xl overflow-hidden">
              {media.slice(0, 4).map((url, idx) => {
                const isLastVisible = idx === 3 && media.length > 4;
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                return (
                  <div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => {
                      setStartIndex(idx);
                      setIsModalOpen(true);
                    }}
                  >
                    {isVideo ? (
                      <video controls className="w-full h-[300px] object-cover" preload="metadata">
                        <source src={url} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
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

      <ImageModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  mediaList={media}
  startIndex={startIndex}
  username={user}
  avatar={avatar}
  content={content}
  fullView // <== cái này là mới thêm nè
/>

    </div>
  );
};

export default Posts;
