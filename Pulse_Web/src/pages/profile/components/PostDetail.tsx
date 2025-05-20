import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Posts from "../components/Posts";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import axios from "axios";
import { fetchLikeCounts, fetchUserLikedPosts } from "../../../redux/slice/likeSlice";
import { ArrowLeft } from "lucide-react";

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
                setPost(res.data);
                setLoading(false);
                dispatch(fetchLikeCounts([res.data._id]));
            } catch (err: any) {
                setError("Failed to load post.");
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
            dispatch(fetchUserLikedPosts());
        }
    }, [postId, dispatch]);

    if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;
    if (!post) return <p className="text-white text-center mt-10">Post not found!</p>;

    return (
        <main className="bg-zinc-900 text-white min-h-screen px-4 pt-4">
            {/* Nút quay về giống MyProfile */}
            <button
                // onClick={() => navigate("/home")}
                onClick={() => navigate(-1)}
                className="hover:bg-white/20 p-3 rounded-full transition text-white cursor-pointer inline-flex items-center mb-4"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="max-w-4xl mx-auto">
                <Posts
                    posts={[post]}
                    username={post.username || "Anonymous"}
                    avatar={post.avatar || "https://picsum.photos/200"}
                    commentCounts={commentCounts}
                />
            </div>
        </main>
    );
};

export default PostDetail;
