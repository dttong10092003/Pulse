// File: ImageModal.tsx
import { useEffect, useState, useRef } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import {
  createComment,
  getCommentsByPost,
  resetComments,
  getCommentCountsByPosts,
  addReply,
} from "../../../redux/slice/commentSilce";
import commentSocket from "../../../utils/socketComment";
import { likePost, unlikePost } from "../../../redux/slice/likeSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image as ImageIcon } from "lucide-react";
import axios from "axios";
dayjs.extend(relativeTime);
interface Props {
  isOpen: boolean;
  onClose: () => void;
  mediaList: string[];
  startIndex: number;
  username: string;
  avatar: string;
  content: string;
  fullView?: boolean;
  postId: string;
  createdAt: string;
  idUserShow: string;
}

const ImageModal = ({
  isOpen,
  onClose,
  mediaList,
  startIndex,
  username,
  avatar,
  content,
  postId,
  createdAt,
  idUserShow,
}: Props) => {
  const [index, setIndex] = useState(startIndex);
  const [commentText, setCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { comments } = useSelector((state: RootState) => state.comments);
  const authUser = useSelector((state: RootState) => state.auth.userDetail);
  const likeCounts = useSelector((state: RootState) => state.likes.likeCounts);
  const likes = likeCounts[postId] || 0;
  const likedPostIds = useSelector((state: RootState) => state.likes.likedPostIds);
  const isLiked = likedPostIds.includes(postId);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const URL_NOTI = import.meta.env.VITE_API_URL_NOTI; // Địa chỉ WebSocket
  useEffect(() => {
    setIndex(startIndex);

    if (isOpen) {
      setCommentText("");
      setReplyingToCommentId(null);
    }
  }, [isOpen, startIndex]);

  useEffect(() => {
    if (isOpen && postId) {
      dispatch(resetComments()); // Dọn dữ liệu trước
      setTimeout(() => {
        dispatch(getCommentsByPost(postId));
      }, 100); // Đợi 1 nhịp nhỏ
    }
  }, [isOpen, postId, dispatch]);

  useEffect(() => {
    if (!commentSocket.connected) {
      commentSocket.connect();
    }

    const eventName = `receive-comment-${postId}`;
    const handler = () => {
      dispatch(getCommentsByPost(postId));
    };
    commentSocket.on(eventName, handler);

    return () => {
      commentSocket.off(eventName, handler);
    };
  }, [dispatch, postId]);

  const handleToggleLike = () => {
    if (!postId) return;
    isLiked ? dispatch(unlikePost(postId)) : dispatch(likePost(postId));
  };

  const toggleExpand = (commentId: string) => {
    setExpandedComments((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };


  const userLoginId = authUser?.userId;
  const userShowId = idUserShow;

  const handleSendNotification = async () => {
    try {
      const senderId = userLoginId;
      const receiverIds: string[] = [userShowId];
      if (userLoginId === userShowId) return;
      if (commentText.trim() === "") return;

      await axios.post(`${URL_NOTI}/noti/create`, {
        type: "comment",
        senderId,
        receiverIds,
        messageContent: "",
        postId: postId,
        commentContent: commentText,
      });

      // alert('Gửi thông báo thành công!');

    } catch (err) {
      console.error('Gửi thông báo thất bại', err);
      alert('Gửi thông báo thất bại!');
    }
  };

  const handleSubmitComment = async () => {
    if (!postId || !commentText.trim()) return;

    try {
      if (replyingToCommentId) {
        await dispatch(addReply({ commentId: replyingToCommentId, text: commentText.trim() }));
        setExpandedComments((prev) => ({ ...prev, [replyingToCommentId]: true }));
        setReplyingToCommentId(null);
      } else {
        if (!authUser) return;
        await dispatch(createComment({
          postId,
          text: commentText.trim(),
        }));
      }
      await dispatch(getCommentCountsByPosts([postId]));
      
      handleSendNotification(); // Gửi thông báo
      setCommentText("");
    } catch (err) {
      console.error("❌ Failed to send comment/reply:", err);
    }
  };

  // ✨ Hàm xử lý highlight mention trọn cụm tên
  const renderMentionedText = (text: string, mentionNames: string[]) => {
    const tokens = text.split(/(\s+)/); // giữ lại dấu cách
    const result: React.ReactNode[] = [];

    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];

      if (token.startsWith("@")) {
        let matched = "";
        let matchLength = 0;

        for (let len = 1; len <= 6 && i + len <= tokens.length; len++) {
          const candidate = tokens.slice(i, i + len).join("").trim();
          if (mentionNames.includes(candidate)) {
            matched = candidate;
            matchLength = len;
          }
        }

        if (matched) {
          result.push(
            <strong key={`mention-${i}`} className="text-blue-300">
              {matched}
            </strong>, " "
          );
          i += matchLength;
          continue;
        }
      }

      result.push(token);
      i++;
    }

    return result;
  };

  const currentMedia = mediaList?.[index] ?? "";
  const isVideo = /\.(mp4|webm|ogg)$/i.test(currentMedia);

  const goNext = () => setIndex((prev) => (prev + 1) % mediaList.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {
        (!mediaList || mediaList.length === 0) ? (
          // 🔵 Trường hợp KHÔNG có ảnh/video
          <div className="w-[520px] bg-zinc-900 text-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-base leading-4">{username}</p>
                  <p className="text-xs text-zinc-400 mt-1">{dayjs(createdAt).fromNow()}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 border-b border-zinc-800 text-sm">
              <p className="text-zinc-200 whitespace-pre-line mb-3">{content}</p>
              <div className="flex items-center gap-6 text-zinc-400">
                <button className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-zinc-400"} cursor-pointer`} onClick={handleToggleLike}>
                  <Heart size={18} />
                  <span className="text-sm">{likes}</span>
                </button>
                <div className="flex items-center gap-1 cursor-pointer">
                  <MessageCircle size={18} /> <span className="text-sm">{comments.length}</span>
                </div>
                <div className="cursor-pointer">
                  <Bookmark size={18} />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="px-4 py-3 max-h-[300px] overflow-y-auto space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <img src={comment.user?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="bg-zinc-800 px-3 py-2 rounded-xl max-w-[300px]">
                        <p className="text-sm font-semibold leading-none mb-1">
                          {comment.user?.firstname} {comment.user?.lastname}
                        </p>
                        <p className="text-sm text-zinc-300">{comment.text}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCommentText(`@${comment.user?.firstname}${comment.user?.lastname} `);
                          setReplyingToCommentId(comment._id);
                          inputRef.current?.focus();
                        }}
                        className="text-xs text-blue-400 hover:underline mt-1 ml-2"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {comment.replies?.length > 0 && (
                    <div className="flex flex-col gap-2 ml-[50px] mt-2">
                      {(expandedComments[comment._id] ? comment.replies : comment.replies.slice(0, 2)).map((reply) => (
                        <div key={reply._id} className="flex flex-col items-start gap-1 ml-1">
                          <div className="flex items-start gap-2">
                            <img src={reply.user?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                            <div className="bg-[#3a3b3c] px-3 py-2 rounded-2xl max-w-[260px]">
                              <p className="text-sm font-semibold leading-none mb-1">
                                {reply.user?.firstname}{reply.user?.lastname}
                              </p>
                              <p className="text-sm text-white">
                                {renderMentionedText(
                                  reply.text || "",
                                  comments.map((c) => `@${c.user?.firstname}${c.user?.lastname}`)
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCommentText(`@${reply.user?.firstname}${reply.user?.lastname} `);
                              setReplyingToCommentId(comment._id);
                              inputRef.current?.focus();
                            }}
                            className="text-xs text-blue-400 hover:underline mt-1 ml-11"
                          >
                            Reply
                          </button>
                        </div>
                      ))}
                      {comment.replies.length > 2 && !expandedComments[comment._id] && (
                        <button
                          className="text-xs text-blue-400 hover:underline ml-2"
                          onClick={() => toggleExpand(comment._id)}
                        >
                          View all {comment.replies.length} reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <img src={authUser?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-9 h-9 rounded-full object-cover" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Comment..."
                  className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-full outline-none text-sm"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <button onClick={handleSubmitComment} className="bg-green-500 hover:bg-green-600 w-10 h-10 flex items-center justify-center rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 🟢 Trường hợp CÓ ảnh/video - giữ layout cũ
          <div className="flex w-full h-full">
            {/* MEDIA bên trái */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
              {mediaList.length > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white z-10 cursor-pointer">
                    <ChevronLeft size={28} />
                  </button>
                  <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white z-10 cursor-pointer">
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
              {!currentMedia ? (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <ImageIcon size={64} />
                </div>
              ) : isVideo ? (
                <video
                  src={currentMedia}
                  autoPlay
                  controls
                  className="w-auto max-w-[100%] h-auto max-h-[100%] object-contain rounded-xl"
                />
              ) : (
                <img
                  src={currentMedia}
                  alt="preview"
                  className="w-auto max-w-[100%] h-auto max-h-[100%] object-contain rounded-xl"
                  onError={(e) => (e.currentTarget.src = "https://i.postimg.cc/y6vYqSkq/image-placeholder.png")}
                />
              )}
            </div>

            <div className="w-[420px] bg-zinc-900 text-white flex flex-col border-l border-zinc-800">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-base leading-4">{username}</p>
                    <p className="text-xs text-zinc-400 mt-1">{dayjs(createdAt).fromNow()}</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 border-b border-zinc-800 text-sm">
                <p className="text-zinc-200 whitespace-pre-line mb-3">{content}</p>
                <div className="flex items-center gap-6 text-zinc-400">
                  <button className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-zinc-400"} cursor-pointer`} onClick={handleToggleLike}>
                    <Heart size={18} />
                    <span className="text-sm">{likes}</span>
                  </button>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <MessageCircle size={18} /> <span className="text-sm">{comments.length}</span>
                  </div>
                  <div className="cursor-pointer">
                    <Bookmark size={18} />
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="px-4 py-3 flex-1 overflow-y-auto space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <img src={comment.user?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                      <div>
                        <div className="bg-zinc-800 px-3 py-2 rounded-xl max-w-[300px]">
                          <p className="text-sm font-semibold leading-none mb-1">
                            {comment.user?.firstname} {comment.user?.lastname}
                          </p>
                          <p className="text-sm text-zinc-300">
                            {comment.text.split(" ").map((word, i) =>
                              word.startsWith("@") ? (
                                <strong key={i} className="text-white">{word} </strong>
                              ) : (
                                word + " "
                              )
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setCommentText(`@${comment.user?.firstname}${comment.user?.lastname} `);
                            setReplyingToCommentId(comment._id);
                            inputRef.current?.focus();
                          }}
                          className="text-xs text-blue-400 hover:underline mt-1 ml-2"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {comment.replies?.length > 0 && (
                      <div className="flex flex-col gap-2 ml-[50px] mt-2">
                        {(expandedComments[comment._id] ? comment.replies : comment.replies.slice(0, 2)).map((reply) => (
                          <div key={reply._id} className="flex flex-col items-start gap-1 ml-1">
                            <div className="flex items-start gap-2">
                              <img src={reply.user?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                              <div className="bg-[#3a3b3c] px-3 py-2 rounded-2xl max-w-[260px]">
                                <p className="text-sm font-semibold leading-none mb-1">
                                  {reply.user?.firstname}{reply.user?.lastname}
                                </p>
                                <p className="text-sm text-white">
                                  {renderMentionedText(
                                    reply.text || "",
                                    comments.map((c) => `@${c.user?.firstname}${c.user?.lastname}`)
                                  )}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setCommentText(`@${reply.user?.firstname}${reply.user?.lastname} `);
                                setReplyingToCommentId(comment._id);
                                inputRef.current?.focus();
                              }}
                              className="text-xs text-blue-400 hover:underline mt-1 ml-11"
                            >
                              Reply
                            </button>
                          </div>
                        ))}
                        {comment.replies.length > 2 && !expandedComments[comment._id] && (
                          <button
                            className="text-xs text-blue-400 hover:underline ml-2"
                            onClick={() => toggleExpand(comment._id)}
                          >
                            View all {comment.replies.length} reply
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <img src={authUser?.avatar || "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg"} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Viết bình luận..."
                    className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-full outline-none text-sm"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <button onClick={handleSubmitComment} className="bg-green-500 hover:bg-green-600 w-10 h-10 flex items-center justify-center rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )
      }
    </div>
  );
}

export default ImageModal;
