import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchAllPosts } from "../../redux/slice/postProfileSlice";
import { PostCard, CategoryFilter, SearchBar } from "./components";

interface PostRedux {
    _id: string;
    content: string;
    media?: string[];
    tags?: string[];
    username?: string;
    avatar?: string;
    userId: string;
    sharedPostId?: string;
}

const Explore: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { posts, loading } = useSelector((state: RootState) => state.postProfile);

    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const categories: string[] = ["All", "Beauty", "Food", "Photography", "Travel"];
    const likeCounts = useSelector((state: RootState) => state.likes.likeCounts);
    const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    const filteredPosts = (posts as PostRedux[])
        .filter(post => !post.sharedPostId) // Bỏ bài chia sẻ
        .filter(post => post.media && post.media.length > 0) // ✅ Chỉ lấy bài có ảnh/video
        .filter(post => {
            const matchesCategory = activeCategory === "All" || post.tags?.includes(activeCategory);
            const matchesSearch = post.content?.toLowerCase().includes(searchTerm.toLowerCase()) || post.username?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });


    return (
        <main className="flex-1 bg-[#1F1F1F] text-white p-4 min-h-screen">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => navigate("/home")} className="text-zinc-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
                {loading && <p className="text-center text-zinc-400 col-span-2">Loading posts...</p>}
                {!loading && filteredPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-zinc-400 py-10 col-span-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A7.5 7.5 0 0112 3a7.5 7.5 0 016.879 14.804M15 12l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg">No posts found!</p>
                    </div>
                )}

                {!loading && filteredPosts.map((post, index) => {
                    const mediaUrl = post.media?.[0] || "";
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);


                    return (
                        <PostCard
                            key={index}
                            post={{
                                 _id: post._id,
                                mediaUrl,
                                isVideo,
                                title: post.content,
                                user: post.username || "Anonymous",
                                avatar: post.avatar || "https://i.pravatar.cc/300",
                                category: post.tags?.[0] || "Beauty",
                                likes: likeCounts[post._id] || 0,
                                comments: commentCounts[post._id] || 0,
                            }}
                        />
                    );
                })}

            </div>
        </main>
    );
};

export default Explore;
