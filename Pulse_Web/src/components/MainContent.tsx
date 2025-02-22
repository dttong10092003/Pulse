import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SearchBar from "../pages/explore/components/SearchBar"; // Import SearchBar
import ImageIcon from "../assets/image.png"; // Import ảnh từ thư mục assets
import { Plus, Image, ChevronDown } from "lucide-react";

const MainContent = () => {
    const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
    const [isModalOpen, setIsModalOpen] = useState(false); // State để mở/đóng modal
    const [postContent, setPostContent] = useState(""); // Nội dung bài viết
    const [isExpanded, setIsExpanded] = useState(false); // Kiểm soát mở rộng input

    const inputRef = useRef<HTMLDivElement>(null);

    // Khi click ra ngoài, thu nhỏ nếu không có nội dung
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                if (!postContent.trim()) {
                    setIsExpanded(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [postContent]);

    const posts = [
        { user: "200Lab Guest", avatar: "https://picsum.photos/200", content: "tết", time: "1h ago", likes: 0, comments: 0 },
        { user: "200Lab Guest", avatar: "https://picsum.photos/200", content: "Hey ducle", time: "3h ago", likes: 1, comments: 0 },
        { user: "200Lab Guest", avatar: "https://picsum.photos/200", content: "Xin chào", time: "yesterday", likes: 1, comments: 0 },
        { user: "200Lab Guest", avatar: "https://picsum.photos/200", content: "hello2", time: "4 days ago", likes: 1, comments: 0 },
    ];

    // Lọc bài viết theo nội dung chứa từ khóa tìm kiếm
    const filteredPosts = posts.filter((post) =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-1 bg-zinc-820 text-white min-h-screen">
            {/* Search Bar + Nút */}
            <div className="p-4 flex items-center gap-3">
                {/* Thanh tìm kiếm */}
                <div className="flex-1">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>

                {/* Nút "+" mở modal */}
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-zinc-700 hover:bg-zinc-600 
                               w-10 h-10 flex items-center justify-center rounded-full text-white transition"
                >
                    <Plus size={22} />
                </button>
            </div>

            {/* Input mở rộng khi bấm vào */}
            <div 
                ref={inputRef} 
                className={`p-4 bg-zinc-800 rounded-2xl transition-all duration-300 
                            ${isExpanded ? "h-auto" : "h-16"} flex flex-col gap-3 ml-3 mr-3`}
            >
                <div className="flex items-start gap-4">
                    {/* Avatar luôn cố định, không bị đẩy xuống */}
                    <div className="flex-shrink-0">
                        <img src="https://picsum.photos/200" 
                            alt="User avatar" 
                            className="w-10 h-10 rounded-full object-cover" />
                    </div>

                    {/* Input mở rộng mà không đẩy avatar xuống */}
                    <div className="flex-1">
                        <textarea
                            placeholder="Start a post..."
                            className="w-full bg-transparent text-lg placeholder:text-zinc-500 
                                    focus:outline-none text-zinc-200 resize-none overflow-hidden"
                            style={{ minHeight: "40px" }} // Đặt chiều cao tối thiểu
                            rows={isExpanded ? 3 : 1} // Tăng chiều cao khi mở rộng
                            onFocus={() => setIsExpanded(true)}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer (chỉ hiện khi mở rộng) */}
                {isExpanded && (
                    <div className="flex items-center justify-between mt-2">
                        {/* Nút thêm ảnh + Chọn danh mục */}
                        <div className="flex items-center gap-2">
                            <button className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition">
                                <Image size={20} className="text-white" />
                            </button>
                            <div className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer">
                                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                <span>Beauty</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                        {/* Nút Post */}
                        <button 
                            className={`px-5 py-2 rounded-3xl transition ${
                                postContent.trim() 
                                    ? "bg-green-500 hover:bg-green-400 text-white cursor-pointer" 
                                    : "bg-zinc-600 text-white opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!postContent.trim()}
                        >
                            Post
                        </button>
                    </div>
                )}
            </div>

            {/* Danh sách bài viết */}
            <div>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => <PostCard key={index} {...post} />)
                ) : (
                    <p className="text-center text-zinc-500 mt-4">No posts found.</p>
                )}
            </div>

            {/* Hiển thị modal khi bấm vào nút "+" */}
            {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}
        </main>
    );
};

const CreatePostModal = ({ onClose }: { onClose: () => void }) => {
    const [postContent, setPostContent] = useState(""); // State lưu nội dung bài viết

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Lớp nền mờ khi modal mở */}
            <div 
                className="absolute inset-0 bg-black/70 "
                onClick={onClose} // Bấm vào nền mờ để đóng modal
            ></div>

            {/* Modal Container */}
            <div className="bg-zinc-900 rounded-2xl p-4 w-[600px] h-auto max-h-[400px] shadow-2xl relative flex flex-col z-50">
                
                {/* Nút đóng (X) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-purple-400 hover:text-white transition"
                >
                    ✖
                </button>

                {/* Nội dung */}
                <div className="flex items-start gap-3 mt-6">
                    <img src="https://picsum.photos/200" className="w-10 h-10 rounded-full object-cover" alt="User" />
                    <textarea
                        placeholder="Start a post..."
                        className="w-full p-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none max-h-[150px] overflow-y-auto"
                        rows={5} // Hiển thị 5 dòng mặc định trước khi có thanh cuộn
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)} // Cập nhật nội dung bài viết
                    />
                </div>

                {/* Footer (Luôn ở dưới cùng) */}
                <div className="flex items-center mt-4">
                    {/* Bọc nút "Thêm ảnh" và "Chọn danh mục" lại gần nhau */}
                    <div className="flex items-center gap-2">
                        {/* Nút thêm ảnh */}
                        <button className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-600 p-2 rounded-lg shadow-md transition">
                            <img src={ImageIcon} alt="Upload Image" className="w-6 h-6 object-cover" />
                        </button>

                        {/* Nút chọn danh mục */}
                        <div className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-600 px-3 py-2 rounded-lg text-white cursor-pointer">
                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                            <span>Beauty</span>
                            ⏷
                        </div>
                    </div>

                    {/* Nút Post (giữ nguyên vị trí bên phải) */}
                    <button 
                        className={`px-5 py-2 rounded-3xl transition ml-auto ${
                            postContent.trim() 
                                ? "bg-zinc-700 hover:bg-zinc-600 text-white opacity-100 cursor-pointer" 
                                : "bg-zinc-700 text-white opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!postContent.trim()} // Nếu không có nội dung, nút bị vô hiệu hóa
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

// 🛠 Giữ nguyên kiểu dữ liệu TypeScript của PostCard
const PostCard = ({
    user,
    avatar,
    content,
    time,
    likes,
    comments,
}: {
    user: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
    comments: number;
}) => {
    return (
        <div className="bg-zinc-800 rounded-2xl p-4 hover:bg-zinc-700 transition-all shadow-lg mt-4 ml-3 mr-3">
            <div className="flex items-start gap-3">
                <img src={avatar || "/placeholder.svg"} alt={user} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{user}</h3>
                            <span className="text-zinc-500">·</span>
                            <p className="text-zinc-500">{time}</p>
                        </div>
                        <button className="text-zinc-500 hover:text-zinc-300">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className="mt-2 text-zinc-300">{content}</p>
                    <div className="flex items-center gap-6 mt-3">
                        <button className="text-zinc-500 hover:text-red-500 flex items-center gap-1">
                            <Heart size={20} />
                            <span>{likes}</span>
                        </button>
                        <button className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                            <MessageCircle size={20} />
                            <span>{comments}</span>
                        </button>
                        <button className="text-zinc-500 hover:text-zinc-300">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MainContent;
