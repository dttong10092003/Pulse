import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Explore = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState(""); // Thêm state searchTerm

    const categories = ["All", "Beauty", "Food", "Photography", "Travel"];

    const posts = [
        { image: "https://picsum.photos/300/200", title: "hello", user: "200Lab Guest", avatar: "https://i.pravatar.cc/300", category: "Food" },
        { image: "https://picsum.photos/301/200", title: "Vietnam Adventure", user: "Chi Hướng", avatar: "https://i.pravatar.cc/301", category: "Photography" },
        { image: "https://picsum.photos/302/200", title: "Gaming World", user: "Binh Pham", avatar: "https://i.pravatar.cc/302", category: "Food" },
        { image: "https://picsum.photos/303/200", title: "Beauty Trends 2025", user: "John Doe2", avatar: "https://i.pravatar.cc/303", category: "Beauty" },
        { image: "https://picsum.photos/304/200", title: "Delicious Street Food", user: "Minh Tran", avatar: "https://i.pravatar.cc/304", category: "Food" },
        { image: "https://picsum.photos/305/200", title: "Hidden Travel Gems", user: "Lisa Nguyen", avatar: "https://i.pravatar.cc/305", category: "Travel" },
    ];

    // Lọc bài viết dựa trên category và search term
    const filteredPosts = posts.filter(post =>
        (activeCategory === "All" || post.category === activeCategory) &&
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc theo tiêu đề
    );

    return (
        <main className="flex-1 bg-[#1F1F1F] text-white p-4">
            {/* Header + Search */}
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => navigate("/home")} className="text-zinc-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm
                        className="w-full p-3 pl-10 bg-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition"
                    />
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full transition ${
                            activeCategory === category ? "bg-white text-black" : "bg-zinc-700 text-white"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <div key={index} className="bg-zinc-900 p-3 rounded-lg">
                            <img src={post.image} alt={post.title} className="w-full h-50 object-cover rounded-lg" />
                            <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
                            <div className="flex items-center justify-between mt-2 text-zinc-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <img src={post.avatar} alt={post.user} className="w-6 h-6 rounded-full" />
                                    <span>{post.user}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    <span>{post.category}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-zinc-400 col-span-2">No posts found.</p>
                )}
            </div>
        </main>
    );
};

export default Explore;
