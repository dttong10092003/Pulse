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
    const { posts, loading, error } = useSelector((state: RootState) => state.postProfile);

    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const categories: string[] = ["All", "Beauty", "Food", "Photography", "Travel"];

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    const filteredPosts = (posts as PostRedux[])
        .filter(post => !post.sharedPostId) // Bỏ bài chia sẻ
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
                {error && <p className="text-center text-red-500 col-span-2">Error: {error}</p>}
                {!loading && filteredPosts.length === 0 && (
                    <p className="text-center text-zinc-400 col-span-2">No posts found.</p>
                )}
                {!loading && filteredPosts.map((post, index) => {
                    const hasImage = !!post.media?.[0];
                    return (
                        <PostCard
                            key={index}
                            post={{
                                ...(hasImage && { image: post.media?.[0] }),
                                title: post.content,
                                user: post.username || "Anonymous",
                                avatar: post.avatar || "https://i.pravatar.cc/300",
                                category: post.tags?.[0] || "Beauty"
                            }}
                        />
                    );
                })}

            </div>
        </main>
    );
};

export default Explore;
