// File: Posts.tsx
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, X, ChevronDown, Image, Share2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ImageModal from "./ImageModal";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, fetchUserPosts, editPost } from "../../../redux/slice/postProfileSlice";
import { likePost, unlikePost } from "../../../redux/slice/likeSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShareModal from "../../../components/ShareModal";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

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
  userId: string;
  sharedPost?: {
    _id: string;
    content: string;
    media?: string[];
    username: string;
    avatar: string;
  };
}

const Posts = ({ posts, username, avatar, commentCounts, onHoldLike }: { posts: Post[]; username: string; avatar: string; commentCounts: Record<string, number>; onHoldLike?: (postId: string) => void; }) => {

  return (
    <div className="divide-zinc-800">
      {posts.map((post, index) => (
        <PostCard
          key={index}
          postId={post._id}
          user={username}
          avatar={avatar}
          postUserId={post.userId}
          content={post.content}
          time={dayjs(post.createdAt).fromNow()}
          comments={commentCounts[post._id] || 0}
          media={post.media || []}
          tags={post.tags || []}
          onHoldLike={onHoldLike} // ✅ THÊM DÒNG NÀY
          createdAt={post.createdAt}
          sharedPost={post.sharedPost}
        />
      ))}
    </div>
  );
};

const PostCard = ({
  postId,
  user,
  avatar,
  postUserId,
  content,
  time,
  createdAt,
  comments,
  media,
  tags,
  onHoldLike, // ✅ THÊM VÀO ĐÂY
  sharedPost,
}: {
  postId: string;
  user: string;
  avatar: string;
  postUserId: string;
  content: string;
  time: string;
  createdAt: string;
  comments: number;
  media: string[];
  tags: string[];
  onHoldLike?: (postId: string) => void; // ✅ THÊM VÀO ĐÂY
  sharedPost?: {
    _id: string;
    content: string;
    media?: string[];
    username: string;
    avatar: string;
  };

}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  // const [liked, setLiked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const likedPostIds = useSelector((state: RootState) => state.likes.likedPostIds);
  const isLiked = likedPostIds.includes(postId);
  const likeCounts = useSelector((state: RootState) => state.likes.likeCounts); // thêm dòng này để lấy số like theo postId
  const likes = likeCounts[postId] || 0; // nếu chưa có thì mặc định 0
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editMediaFiles, setEditMediaFiles] = useState<string[]>(media || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const URL_NOTI = import.meta.env.VITE_API_URL_NOTI
  const isOwner = userId === postUserId;
  const tagOptions = ["Beauty", "Food", "Photography", "Travel"];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // const tagColors: Record<string, string> = {
  //   Beauty: "bg-pink-500",
  //   Food: "bg-yellow-400",
  //   Photography: "bg-blue-400",
  //   Travel: "bg-green-400",
  // };

  useEffect(() => {
    if (isEditing) {
      setSelectedTags([...tags]);
    }
  }, [isEditing]);

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
      if (userId) await dispatch(fetchUserPosts(userId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      toast.error("Delete post failed: " + err);
    }
  };

  const userLoginId = useSelector((state: RootState) => state.auth.user?._id);
  // console.log("userLoginId", userLoginId);
  const userShowId = postUserId;
  // console.log("userShowId", userShowId);
  const handleSendNotification = async () => {
    try {
      const senderId = userLoginId;
      const receiverIds: string[] = [userShowId];

      await axios.post(`${URL_NOTI}/noti/create`, {
        type: "like",
        senderId,
        receiverIds,
        messageContent: "",
        postId: postId,
        commentContent: "",
      });

      // alert('Gửi thông báo thành công!');

    } catch (err) {
      console.error('Gửi thông báo thất bại', err);
      alert('Gửi thông báo thất bại!');
    }
  };


  const handleToggleLike = () => {
    if (!userId) return;
    if (isLiked) {
      dispatch(unlikePost(postId));
    } else {

      if (userLoginId !== userShowId) {

        handleSendNotification();

      }
      dispatch(likePost(postId));

    }

  };


  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      await dispatch(
        editPost({
          postId,
          content: editContent,
          media: editMediaFiles,
          tags: selectedTags,
        })
      ).unwrap();
      setIsEditing(false);
      toast.success("Post updated successfully!");
    } catch (error) {
      toast.error("Update post failed!");
    }
  };
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };


  return (
    <div className="p-4 hover:bg-zinc-900/50">
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
          onClick={() => {
            if (postUserId) {
              navigate(`/home/user-info/${postUserId}`);
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{user}</h3>
              <p className="text-xs text-zinc-500">{time}</p>
            </div>
            <div className="relative">
              <button
                className="text-zinc-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
              >
                <MoreHorizontal size={20} />
              </button>

              {/* {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-36 bg-zinc-800 shadow-lg rounded-lg z-50 py-2"
                >
                  <button className="flex justify-between items-center w-full px-4 py-2 hover:bg-zinc-700 text-white cursor-pointer" onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}>
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
              )} */}
              {showMenu && isOwner && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-36 bg-zinc-800 shadow-lg rounded-lg z-50 py-2"
                >
                  <button
                    className="flex justify-between items-center w-full px-4 py-2 hover:bg-zinc-700 text-white cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    Edit
                    <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 000-1.77l-2.98-2.98a1.25 1.25 0 00-1.77 0l-1.83 1.83 4.75 4.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button
                    className="flex justify-between items-center w-full px-4 py-2 hover:bg-zinc-700 text-red-400 cursor-pointer"
                    onClick={handleDeletePost}
                  >
                    Delete
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zm3-9h2v7H9V10zm4 0h2v7h-2v-7zm5-5h-3.5l-1-1h-5l-1 1H5v2h14V5z" />
                    </svg>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* <p className="mt-2">{content}</p> */}
          {isEditing ? (
            <div
              ref={inputRef}
              className="p-4 bg-[#1F1F1F] rounded-2xl transition-all duration-300 mt-4 mx-4 flex flex-col gap-3"
            >
              <div className="flex items-start gap-4">

                <div className="flex-1">
                  <textarea
                    placeholder="Edit your post..."
                    className="w-full bg-transparent text-lg placeholder:text-zinc-500 focus:outline-none text-white resize-none overflow-hidden"
                    style={{ minHeight: "40px" }}
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  {editMediaFiles.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 max-w-full">
                      {editMediaFiles.map((url, idx) => (
                        <div key={idx} className="relative w-full max-w-sm">
                          <button
                            onClick={() =>
                              setEditMediaFiles((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-sm z-10 hover:bg-black/80 cursor-pointer"
                          >
                            <X size={16} />
                          </button>

                          {url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video
                              src={url}
                              controls
                              className="w-full max-h-80 object-cover rounded"
                              style={{ aspectRatio: "16/9" }}
                            />
                          ) : (
                            <img
                              src={url}
                              alt={`edit-media-${idx}`}
                              className="w-full max-h-80 object-cover rounded"
                              style={{ aspectRatio: "16/9" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      id={`edit-upload-${postId}`}
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const base64Files = await Promise.all(files.map(convertFileToBase64));
                        setEditMediaFiles((prev) => [...prev, ...base64Files]);
                      }}
                    />
                    <label
                      htmlFor={`edit-upload-${postId}`}
                      className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition cursor-pointer text-white"
                    >
                      <Image size={20} />
                    </label>
                  </>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer"
                      onClick={() => setIsTagDropdownOpen(prev => !prev)}
                    >
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span>{selectedTags[0] || "Select tag"}</span>
                      <ChevronDown size={16} />
                    </button>

                    {isTagDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-40 bg-zinc-800 rounded-lg shadow-lg py-1">
                        {tagOptions.map((tag) => (
                          <div
                            key={tag}
                            className={`px-4 py-2 hover:bg-zinc-700 cursor-pointer text-white ${selectedTags.includes(tag) ? "bg-zinc-700" : ""}`}
                            onClick={() => {
                              setSelectedTags([tag]);
                              setIsTagDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${tag === "Beauty" ? "bg-pink-500" :
                                tag === "Food" ? "bg-yellow-400" :
                                  tag === "Photography" ? "bg-blue-400" :
                                    tag === "Travel" ? "bg-green-400" : "bg-gray-400"}`} />
                              <span>{tag}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(content);
                      setEditMediaFiles(media || []);
                    }}
                    className="px-5 py-2 bg-zinc-600 hover:bg-gray-500 text-white rounded-3xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving} // 👉 Khi đang saving thì disable
                    className={`px-5 py-2 ${isSaving ? "bg-green-300" : "bg-green-500 hover:bg-green-400"} text-white rounded-3xl transition cursor-pointer`}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>


                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2">{content}</p>
              {media.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-1 w-full rounded-xl overflow-hidden">
                  {media.slice(0, 4).map((url, idx) => {
                    const isLastVisible = idx === 3 && media.length > 4;
                    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                    return (
                      <div
                        key={idx}
                        className="relative overflow-hidden cursor-pointer"
                        onClick={() => {
                          setStartIndex(idx);
                          setIsModalOpen(true);
                        }}
                      >
                        {isVideo ? (
                          <video
                            src={url}
                            controls
                            className="w-full rounded-lg"
                            style={{ aspectRatio: "16/9" }}
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`media-${idx}`}
                            className="w-full h-[300px] object-cover pointer-events-none"
                          />
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


              {sharedPost && (
                <div
                  onClick={() => navigate(`/home/post/${sharedPost._id}`)}
                  className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={sharedPost.avatar}
                      className="w-8 h-8 rounded-full object-cover border border-white"
                      alt="Shared Avatar"
                    />
                    <span className="text-sm font-semibold text-white truncate max-w-[70%]">
                      {sharedPost.username}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {sharedPost.content}
                  </p>
                  {sharedPost.media?.[0] && (
                    <div className="mt-3">
                      <img
                        src={sharedPost.media[0]}
                        className="w-full object-cover rounded-xl border border-zinc-700"
                        alt="Shared media"
                      />
                    </div>
                  )}
                </div>
              )}

            </>

          )}

          {/* {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-white">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded-full"
                >
                  <div className={`w-2 h-2 ${tagColors[tag] || "bg-gray-400"} rounded-full`} />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )} */}


          {onHoldLike && (
            <p
              onClick={() => onHoldLike(postId)}
              className="text-xs text-zinc-400 cursor-pointer hover:underline mb-1"
            >
              View list of people who liked
            </p>
          )}

          <div className="flex items-center gap-6 mt-3">
            <button
              className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-zinc-500"} cursor-pointer`}
              onClick={handleToggleLike}
            >
              <Heart size={20} />
              <span>{likes}</span>
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

            <button
              className="text-zinc-500 cursor-pointer"
              onClick={() => setIsShareOpen(true)}
            >
              <Share2 size={20} />
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
          createdAt={createdAt}
          idUserShow={postUserId}
        />
      </div>
      {isShareOpen && (
        <ShareModal
          sharedPost={{ _id: postId, content, media, username: user, avatar }}
          onClose={() => setIsShareOpen(false)}
        />
      )}

    </div>
  );
};

export default Posts;
