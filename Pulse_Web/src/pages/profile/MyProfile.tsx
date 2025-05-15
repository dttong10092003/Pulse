import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft, ChevronDown, Image, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Media, Posts } from "./components";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserPosts, createPost } from "../../redux/slice/postProfileSlice";
import { fetchUserLikedPosts } from "../../redux/slice/likeSlice";
import { getFollowers, getFollowings } from "../../redux/slice/followSlice";
import api from "../../services/api";
import { getUserDetails } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";

const MyProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState("Posts");
    const userDetail = useSelector((state: RootState) => state.auth.userDetail); // Lấy userDetail từ Redux
    const userId = useSelector((state: RootState) => state.auth.user?._id);
    const { posts: userPosts, count } = useSelector((state: RootState) => state.postProfile);
    const [postContent, setPostContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const followers = useSelector((state: RootState) => state.follow.followers);
    const followings = useSelector((state: RootState) => state.follow.followings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFollowTab, setActiveFollowTab] = useState<"followers" | "following">("followers");
    const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);
    const [likedUsers, setLikedUsers] = useState<any[]>([]);
    const [likeModalOpen, setLikeModalOpen] = useState(false);
    const [isLoadingLikes, setIsLoadingLikes] = useState(false);
    const [selectedTag, setSelectedTag] = useState("Beauty");
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const tagOptions = [
        { label: "Beauty", color: "bg-pink-500" },
        { label: "Food", color: "bg-yellow-400" },
        { label: "Photography", color: "bg-blue-400" },
        { label: "Travel", color: "bg-green-400" },
    ];

    const handleHoldLike = async (postId: string) => {
        try {
            setIsLoadingLikes(true);

            const res = await api.get(`/likes/${postId}`); // [{ userId, timestamp }]
            const likeList = res.data;

            const userDetails: any[] = [];

            for (const like of likeList) {
                try {
                    const user = await dispatch(getUserDetails(like.userId)).unwrap();
                    userDetails.push({
                        ...user,
                        timestamp: like.timestamp
                    });
                } catch (err) {
                    console.error("❌ Lỗi fetch userId:", like.userId, err);
                }
            }

            setLikedUsers(userDetails);
            setLikeModalOpen(true);
        } catch (err) {
            console.error("🔥 Lỗi lấy danh sách like:", err);
        } finally {
            setIsLoadingLikes(false);
        }
    };



    useEffect(() => {
        if (userId) {
            dispatch(getFollowers(userId));
            dispatch(getFollowings(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserLikedPosts());
        }
    }, [dispatch, userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                if (!postContent.trim()) setIsExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [postContent]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserPosts(userId));
        }
    }, [dispatch, userId]);
    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setMediaFiles((prev) => [...prev, ...files]);
    };


    const handleBack = () => {
        localStorage.setItem("activeItem", "Home"); // Cập nhật sidebar về Home
        window.dispatchEvent(new Event("storage")); // Phát sự kiện để Sidebar cập nhật lại
        navigate("/home"); // Chuyển hướng về trang Home
    };
    // Profile Data lấy từ Redux
    const profileData = {
        firstname: userDetail?.firstname,
        lastname: userDetail?.lastname,
        handle: `@${userDetail?.username}`,
        bio: userDetail?.bio || "Hello", // Nếu không có tiểu sử, mặc định là "Hello"

    };
    const username = `${profileData.firstname} ${profileData.lastname}`;
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
                alert("You are not logged in!");
                return;
            }

            setIsPosting(true); // 🟢 Bắt đầu loading

            const base64Media = await Promise.all(
                mediaFiles.map((file) => convertToBase64(file))
            );

            await dispatch(createPost({
                content: postContent,
                media: base64Media.length ? base64Media : undefined,
                tags: [selectedTag],
            })).unwrap();

            await dispatch(fetchUserPosts(userId!));
            setPostContent("");
            setMediaFiles([]);
            setIsExpanded(false);
            toast.success("Post created successfully!");
        } catch (err) {
            toast.error("Posting failed: " + err);
        } finally {
            setIsPosting(false); // 🔴 Kết thúc loading
        }
    };

    return (

        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-black p-6 rounded-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white cursor-pointer">
                            <X size={24} />
                        </button>
                        <div className="mb-4 mt-8">
                            <h2 className="text-xl font-semibold text-center text-white">Followers & Following</h2>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setActiveFollowTab("followers")}
                                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${activeFollowTab === "followers" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
                            >
                                Followers
                            </button>
                            <button
                                onClick={() => setActiveFollowTab("following")}
                                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${activeFollowTab === "following" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
                            >
                                Following
                            </button>
                        </div>

                        <div className="max-h-[25vh] overflow-y-auto scrollbar-dark">
                            {activeFollowTab === "followers" ? (
                                followers.length === 0 ? (
                                    <p className="text-center text-gray-500">No followers yet.</p>
                                ) : (
                                    <ul>
                                        {followers.map((f, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() => navigate(`/home/user-info/${f.user._id}`)}
                                                className="flex justify-between items-center py-2 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={f.user.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                                                    <span>{f.user.firstname} {f.user.lastname}</span>
                                                </div>
                                                <span className="text-blue-500">Friend</span>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            ) : followings.length === 0 ? (
                                <p className="text-center text-gray-500">No followings yet.</p>
                            ) : (
                                <ul>
                                    {followings.map((f, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => navigate(`/home/user-info/${f.user._id}`)}
                                            className="flex justify-between items-center py-2 cursor-pointer "
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={f.user.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                                                <span>{f.user.firstname} {f.user.lastname}</span>
                                            </div>
                                            <span className="text-blue-500">Friend</span>
                                        </li>
                                    ))}

                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}


            <main className="bg-[#1F1F1F] text-white">
                {/* Header */}
                <div className="relative w-full h-48 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${userDetail?.backgroundAvatar})`,
                    }}>
                    <div className="absolute inset-0 bg-black/50 " />
                    <button className="absolute hover:bg-white/20 top-4 left-4 p-3 rounded-full transition text-white cursor-pointer" onClick={handleBack}>
                        <ArrowLeft size={28} />
                    </button>
                </div>
                <div className="relative px-4 -mt-16 flex flex-col items-start">
                    <div className="flex items-center gap-4">
                        <img src={userDetail?.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
                    </div>
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold">{profileData.firstname} {profileData.lastname}</h2>
                        <p className="text-zinc-500">{profileData.handle}</p>
                    </div>
                    <p className="text-zinc-400 mt-2">{profileData.bio}</p>
                    <div className="mt-4 flex items-center justify-between w-full text-zinc-400">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1 cursor-pointer"><MessageSquare size={18} /> {count} posts</span>
                            <span
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                    setActiveFollowTab("followers");
                                    setIsModalOpen(true);
                                }}
                            >
                                <Users size={18} /> {followers.length} followers
                            </span>

                            <span className="flex items-center gap-1 cursor-pointer"><Share2 size={18} /></span>
                        </div>
                        <button className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-600 cursor-pointer" onClick={() => navigate("/home/edit-profile")}>
                            <UserRoundPen size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-4 bg-[#181818] p-1 rounded-full">
                    <button
                        onClick={() => setActiveTab("Posts")}
                        className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Posts" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab("Featured")}
                        className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Featured" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                    >
                        Featured
                    </button>
                    <button
                        onClick={() => setActiveTab("Media")}
                        className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === "Media" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
                    >
                        Media
                    </button>
                </div>
                {/* New Post Input Section */}
                {activeTab === "Posts" && (
                    <div
                        ref={inputRef}
                        className={`p-4 bg-[#1F1F1F] rounded-2xl transition-all duration-300 mt-4 mx-4 ${isExpanded ? "h-auto" : "h-16"
                            } flex flex-col gap-3`}
                    >
                        <div className="flex items-start gap-4">
                            <img
                                src={userDetail?.avatar}
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
                                                        style={{ aspectRatio: '16/9' }}
                                                    />
                                                ) : (
                                                    <video
                                                        src={URL.createObjectURL(file)}
                                                        controls
                                                        className="w-full max-h-80 object-cover rounded"
                                                        style={{ aspectRatio: '16/9' }}
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
                                    <>
                                        <button
                                            className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition cursor-pointer text-white"
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
                                    </>
                                    {/* <div className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer ">
                                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                        <span>Beauty</span>
                                        <ChevronDown size={16} />
                                    </div> */}
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                                            className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer"
                                        >
                                            <div className={`w-3 h-3 ${tagOptions.find(t => t.label === selectedTag)?.color} rounded-full`}></div>
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
                                                            <div className={`w-3 h-3 ${tag.color} rounded-full`}></div>
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
                )}

                {activeTab === "Posts" && (
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-dark px-4">
                        {userPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-zinc-400 py-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A7.5 7.5 0 0112 3a7.5 7.5 0 016.879 14.804M15 12l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-lg">No posts found!</p>
                            </div>
                        ) : (
                            <Posts
                                posts={userPosts}
                                username={username}
                                avatar={userDetail?.avatar ?? "default-avatar-url"}
                                commentCounts={commentCounts}
                                onHoldLike={handleHoldLike}
                            />
                        )}
                    </div>
                )}


                {activeTab === "Media" && (
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-dark px-4">
                        <Media />
                    </div>
                )}
                {likeModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setLikeModalOpen(false)}>
                        <div className="bg-zinc-900 p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4 text-white text-center">
                                Người đã like bài viết ({likedUsers.length})
                            </h2>
                            <button className="absolute top-4 right-4 text-white" onClick={() => setLikeModalOpen(false)}>
                                <X size={24} />
                            </button>

                            {isLoadingLikes ? (
                                <p className="text-center text-zinc-400">Đang tải danh sách...</p>
                            ) : likedUsers.length === 0 ? (
                                <p className="text-center text-zinc-400">Chưa có ai like bài viết này.</p>
                            ) : (
                                <ul className="space-y-3">

                                    {likedUsers.map((user, idx) => (

                                        <li
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation(); // chống click lan ra modal
                                                navigate(`/home/user-info/${user._id}`);
                                            }}
                                            className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded cursor-pointer"
                                        >
                                            <img src={user.avatar || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full object-cover" />
                                            <span className="text-white">{user.firstname} {user.lastname}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </>
    );
};

export default MyProfile;

