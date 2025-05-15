import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Posts from "../components/Posts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
                setPost(res.data);
                setLoading(false);
            } catch (err: any) {
                setError("Failed to load post.");
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;
    if (!post) return <p className="text-white text-center mt-10">Post not found!</p>;

    return (
        <main className="bg-zinc-900 text-white min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <div className="divide-zinc-800">
                    <Posts
                        posts={[post]}
                        username={post.username || "Anonymous"}
                        avatar={post.avatar || "https://picsum.photos/200"}
                        commentCounts={commentCounts}
                    />
                </div>
            </div>
        </main>

    );
};

export default PostDetail;
