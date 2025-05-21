import { ChevronDown, Image, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAllPosts, createPost } from "../redux/slice/postProfileSlice";
import SearchBar from "../pages/explore/components/SearchBar";
import Posts from "../pages/profile/components/Posts";
import { fetchLikeCounts, fetchUserLikedPosts } from "../redux/slice/likeSlice";
import { getCommentCountsByPosts } from "../redux/slice/commentSilce"
import commentSocket from "../utils/socketComment";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../redux/slice/userSlice";
import api from "../services/api";
import { checkNSFW } from "../utils/nsfwChecker";
import axios from "axios";
const MainContent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, loading } = useSelector((state: RootState) => state.postProfile);
    const navigate = useNavigate();
    const userDetail = useSelector((state: RootState) => state.auth.userDetail);
    const [postContent, setPostContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);
    const [selectedTag, setSelectedTag] = useState("Beauty");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const tagOptions = [
        { label: "Beauty", color: "bg-pink-500" },
        { label: "Food", color: "bg-yellow-400" },
        { label: "Photography", color: "bg-blue-400" },
        { label: "Travel", color: "bg-green-400" },
    ];

    const [likeModalOpen, setLikeModalOpen] = useState(false);
    const [likedUsers, setLikedUsers] = useState<any[]>([]);
    const [isLoadingLikes, setIsLoadingLikes] = useState(false);

    const userId = userDetail?.userId;
    console.log("userid------", userId);
    const handleHoldLike = async (postId: string) => {
        try {
            setIsLoadingLikes(true);
            const res = await api.get(`/likes/${postId}`); // giống MyProfile
            const likeList = res.data;

            const userDetails: any[] = [];
            for (const like of likeList) {
                try {
                    const user = await dispatch(getUserDetails(like.userId)).unwrap();
                    userDetails.push({
                        ...user,
                        _id: user.userId || user._id,
                        timestamp: like.timestamp
                    });
                } catch (err) {
                    console.error("❌ Lỗi khi lấy user từ userId:", like.userId, err);
                }
            }

            setLikedUsers(userDetails);
            setLikeModalOpen(true);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách người đã like:", err);
        } finally {
            setIsLoadingLikes(false);
        }
    };

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUserLikedPosts());
    }, [dispatch]);

    useEffect(() => {
        if (posts.length > 0) {
            const postIds = posts.map((p) => p._id);
            dispatch(fetchLikeCounts(postIds));
            dispatch(getCommentCountsByPosts(postIds));
        }
    }, [dispatch, posts]);

    useEffect(() => {
        commentSocket.connect();
        commentSocket.on("newComment", ({ postId }) => {
            dispatch(getCommentCountsByPosts([postId]));
        });

        return () => {
            commentSocket.off("newComment"); // Cleanup khi component bị unmount
            commentSocket.disconnect();
        };
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                if (!postContent.trim()) setIsExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [postContent]);

    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setMediaFiles((prev) => [...prev, ...files]);
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };


    const handleCreatePost = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not logged in!");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/ban-status/${userId}`);
                const { isActive, dateOpenBan } = response.data;

                console.log("✅ User status:", { isActive, dateOpenBan });

                // 👉 Bạn có thể xử lý logic tùy vào trạng thái
                if (!isActive && dateOpenBan) {
                    const unlockTime = new Date(dateOpenBan);
                    const day = String(unlockTime.getDate()).padStart(2, '0');
                    const month = String(unlockTime.getMonth() + 1).padStart(2, '0'); // Lưu ý: getMonth() trả về 0–11
                    const year = unlockTime.getFullYear();

                    const formattedDate = `${day}/${month}/${year}`;
                    console.log(`🔒 User bị ban đến: ${formattedDate}`);
                    alert(`Your posting privileges have been temporarily suspended due to violations of our community guidelines.\n You will regain access on ${formattedDate}`);
                }
                else {


                    setIsPosting(true);
                    // ✅ Convert và kiểm tra NSFW
                    for (const file of mediaFiles) {
                        if (file.type.startsWith("image/")) {
                            const base64 = await convertToBase64(file);
                            const img = new window.Image();
                            img.src = base64;

                            await new Promise((resolve) => (img.onload = resolve));

                            const isNSFW = await checkNSFW(img);
                            if (isNSFW) {
                                toast.error("Image contains sensitive content (NSFW). Cannot post.");
                                setIsPosting(false);
                                return;
                            }
                        }
                    }
                    const base64Media = await Promise.all(mediaFiles.map(convertToBase64));
                    console.log("asdd");

                    await dispatch(createPost({
                        content: postContent,
                        media: base64Media.length ? base64Media : undefined,
                        tags: [selectedTag],
                    })).unwrap();
                    console.log("Post created successfullyzzz");

                    await dispatch(fetchAllPosts());
                    setPostContent("");
                    setMediaFiles([]);
                    setIsExpanded(false);
                    toast.success("Posting successful!");
                    console.log("Post created successfullyttttttttttttt");


                }
            } catch (err) {
                console.error("❌ Lỗi khi lấy trạng thái ban của user:");
            }



        } catch (err) {
            toast.error("Posting failed: " + err);
        } finally {
            setIsPosting(false);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const contentMatch = post.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const usernameMatch = post.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return contentMatch || usernameMatch;
    });


    return (
        <main className="bg-zinc-900 text-white min-h-screen">
            <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
                <button
                    onClick={() => setIsExpanded(true)}
                    className="bg-zinc-700 hover:bg-zinc-600 w-10 h-10 flex items-center justify-center rounded-full"
                >
                    <Plus size={22} />
                </button>
            </div>

            <div
                ref={inputRef}
                className={`p-4 bg-zinc-800 rounded-2xl transition-all duration-300 mt-4 mx-4 ${isExpanded ? "h-auto" : "h-16"
                    } flex flex-col gap-3`}
            >
                <div className="flex items-start gap-4">
                    <img
                        src={userDetail?.avatar || "https://picsum.photos/200"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <textarea
                            placeholder="Start a post..."
                            className="w-full bg-transparent text-lg placeholder:text-zinc-500 focus:outline-none text-zinc-200 resize-none overflow-hidden"
                            style={{ minHeight: "40px" }}
                            rows={isExpanded ? 3 : 1}
                            onFocus={() => setIsExpanded(true)}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                        {mediaFiles.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2 max-w-full">
                                {mediaFiles.map((file, index) => (
                                    <div key={index} className="relative w-full max-w-sm">
                                        <button
                                            onClick={() =>
                                                setMediaFiles((prev) => prev.filter((_, i) => i !== index))
                                            }
                                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-sm z-10 hover:bg-black/80 cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>

                                        {file.type.startsWith("image/") ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`media-${index}`}
                                                className="w-full max-h-80 object-cover rounded"
                                            />
                                        ) : (
                                            <video
                                                src={URL.createObjectURL(file)}
                                                controls
                                                className="w-full max-h-80 object-cover rounded"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Image size={20} className="text-white" />
                            </button>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleMediaSelect}
                                multiple
                            />
                            {/* <div className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer">
                                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                <span>Beauty</span>
                                <ChevronDown size={16} />
                            </div> */}
                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                                    className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer"
                                >
                                    <div className={`w-3 h-3 ${tagOptions.find(t => t.label === selectedTag)?.color} rounded-full`} />
                                    <span>{selectedTag}</span>
                                    <ChevronDown size={16} />
                                </button>

                                {showTagDropdown && (
                                    <div className="absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <ul className="py-1 text-white">
                                            {tagOptions.map((tag) => (
                                                <li
                                                    key={tag.label}
                                                    onClick={() => {
                                                        setSelectedTag(tag.label);
                                                        setShowTagDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                                                >
                                                    <div className={`w-3 h-3 ${tag.color} rounded-full`} />
                                                    <span>{tag.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </div>
                        <button
                            className={`px-5 py-2 rounded-3xl transition ${postContent.trim() && !isPosting
                                ? "bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                                : "bg-zinc-600 text-white opacity-50 cursor-not-allowed"
                                }`}
                            disabled={!postContent.trim() || isPosting}
                            onClick={handleCreatePost}
                        >
                            {isPosting ? "Posting..." : "Post"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 mx-4 max-h-[70vh] overflow-y-auto scrollbar-dark rounded-2xl">
                {loading ? (
                    <p className="text-center text-zinc-400">Loading posts...</p>
                ) : filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-zinc-400 py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A7.5 7.5 0 0112 3a7.5 7.5 0 016.879 14.804M15 12l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg">No posts found!</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <Posts
                            key={post._id}
                            posts={[post]}
                            username={post.username || "Anomymous"}
                            avatar={post.avatar || "https://picsum.photos/200"}
                            commentCounts={commentCounts}
                            onHoldLike={handleHoldLike}
                        />
                    ))
                )}

            </div>
            {likeModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setLikeModalOpen(false)}>
                    <div className="bg-zinc-900 p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4 text-white text-center">
                            People liked the post ({likedUsers.length})
                        </h2>
                        <button className="absolute top-4 right-4 text-white cursor-pointer" onClick={() => setLikeModalOpen(false)}>
                            <X size={24} />
                        </button>

                        {isLoadingLikes ? (
                            <p className="text-center text-zinc-400">Loading list...</p>
                        ) : likedUsers.length === 0 ? (
                            <p className="text-center text-zinc-400">No one has liked this post yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {likedUsers.map((user, idx) => (
                                    <li
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLikeModalOpen(false);
                                            navigate(`/home/user-info/${user.userId || user._id}`);
                                        }}
                                        className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded cursor-pointer"
                                    >
                                        <img
                                            src={user.avatar || "https://i.pravatar.cc/100"}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="text-white">{user.firstname} {user.lastname}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

        </main>
    );
};

export default MainContent;
