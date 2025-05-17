import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchTopStats } from "../../../redux/slice/postProfileSlice";

const TopStatsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const topStats = useSelector((state: RootState) => state.postProfile.topStats);
  const loadingTopStats = useSelector((state: RootState) => state.postProfile.loadingTopStats);

  useEffect(() => {
    dispatch(fetchTopStats());
  }, []);

  const renderTable = (
    title: string,
    data: { id: string; user: string; content: string; metric: number }[],
    metricLabel: string
  ) => (
    <div className="bg-white rounded-2xl p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-3 text-blue-600">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">{metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((post, index) => (
              <tr key={post.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{post.user}</td>
                <td className="px-4 py-2 truncate max-w-[250px]">{post.content}</td>
                <td className="px-4 py-2 font-medium text-right">{post.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loadingTopStats || !topStats){
    return (
      <div className="text-white bg-zinc-900 p-6 rounded-xl shadow">
        ⏳ Loading top stats...
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      <h2 className="text-xl font-bold mb-4">📊 Top Posts Stats</h2>

      {renderTable(
        "🔥 Most Liked Posts",
        topStats.topLikedPosts.map(p => ({
          id: p._id,
          user: p.username,
          content: p.content,
          metric: p.likes || 0
        })),
        "Likes"
      )}

      {renderTable(
        "💬 Most Commented Posts",
        topStats.topCommentedPosts.map(p => ({
          id: p._id,
          user: p.username,
          content: p.content,
          metric: p.comments || 0
        })),
        "Comments"
      )}

      {renderTable(
        "🔄 Most Shared Posts",
        topStats.topSharedPosts.map(p => ({
          id: p._id,
          user: p.username,
          content: p.content,
          metric: p.shares || 0
        })),
        "Shares"
      )}
    </div>
  );
};

export default TopStatsPanel;
