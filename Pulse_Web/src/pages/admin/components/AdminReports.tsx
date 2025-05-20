import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  username?: string;
  avatar?: string;
  tags?: string[];
}

const AdminReports = () => {
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReportedPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      const filtered = res.data.filter((post: Post) =>
        post.tags?.includes("reported")
      );
      setReportedPosts(filtered);
    } catch (err) {
      console.error("❌ Error fetching reported posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">
        🚨 Flagged Posts for Review
      </h1>

      {loading ? (
        <p className="text-zinc-400">Loading reported posts...</p>
      ) : reportedPosts.length === 0 ? (
        <p className="text-zinc-400">No reported posts found.</p>
      ) : (
        <ul className="space-y-4">
          {reportedPosts.map((post) => (
            <li
              key={post._id}
              className="p-4 bg-zinc-800 rounded-lg border border-red-400 shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={post.avatar || "https://picsum.photos/40"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">{post.username || "Anonymous user"}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(post.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
              </div>
              <p className="text-white whitespace-pre-wrap">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReports;
