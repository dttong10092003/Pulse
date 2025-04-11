import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft, ChevronDown, Image, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserPosts, createPost } from "../../redux/slice/postProfileSlice";
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

            const base64Media = await Promise.all(
                mediaFiles.map((file) => convertToBase64(file))
            );

            await dispatch(createPost({
                content: postContent,
                media: base64Media.length ? base64Media : undefined,
            })).unwrap();

            await dispatch(fetchUserPosts(userId!));
            setPostContent("");
            setMediaFiles([]);
            setIsExpanded(false);
        } catch (err) {
            alert("Posting failed: " + err);
        }
    };



    return (
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
                        <span className="flex items-center gap-1 cursor-pointer"><Users size={18} /> 10  followers</span>
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
                                            <X size={16}  />
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

                            <div className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer ">
                                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                <span>Beauty</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                        <button
                            className={`px-5 py-2 rounded-3xl transition ${postContent.trim()
                                ? "bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                                : "bg-zinc-600 text-white opacity-50 cursor-not-allowed"
                                }`}
                            disabled={!postContent.trim()}
                            onClick={handleCreatePost}


                        >
                            Post
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-4">
                {activeTab === "Posts" && <Posts posts={userPosts} username={username} avatar={userDetail?.avatar ?? "default-avatar-url"} />}
                {activeTab === "Featured" && <Featured />}
                {activeTab === "Media" && <Media />}
            </div>


        </main>
    );
};

export default MyProfile;

