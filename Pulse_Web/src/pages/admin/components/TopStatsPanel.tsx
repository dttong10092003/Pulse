import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchTopStats } from "../../../redux/slice/postProfileSlice";

const TopStatsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const topStats = useSelector((state: RootState) => state.postProfile.topStats);
  const loadingTopStats = useSelector((state: RootState) => state.postProfile.loadingTopStats);

  useEffect(() => {
    if (!topStats) {
      dispatch(fetchTopStats());
    }
  }, [dispatch, topStats]);

  const renderTable = (
    title: string,
    data: { id: string; user: string; content: string; metric: number }[],
    metricLabel: string
  ) => (
    <div className="bg-white rounded-2xl p-3 shadow mb-3">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
            <tr className="h-5.7">
              <th className="w-[10%]">STT</th>
              <th className="w-[30%]">User</th>
              <th className="w-[55%]">Content</th>
              <th className="w-[5%]">{metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((post, index) => (
              <tr key={`${post.id}-${index}`} className="border-b" style={{ height: '25px' }}>
                <td className="w-[10%]">{index + 1}</td>
                <td className="w-[30%]">{post.user}</td>
                <td className="w-[55%] truncate max-w-[250px]">{post.content}</td>
                <td className="w-[5%] font-medium text-right">{post.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loadingTopStats || !topStats) {
    return (
      <div className="text-white bg-zinc-900 p-6 rounded-xl shadow">
        ⏳ Loading top stats...
      </div>
    );
  }

  return (
    <div className="text-white mt-1">
      {renderTable(
        "🔥 Most Liked Posts",
        topStats.topLikedPosts.map(p => ({
          id: p._id,
          user: p.user,
          content: p.content,
          metric: p.likes || 0
        })),
        "Likes"
      )}

      {renderTable(
        "💬 Most Commented Posts",
        topStats.topCommentedPosts.map(p => ({
          id: p._id,
          user: p.user,
          content: p.content,
          metric: p.comments || 0
        })),
        "Comments"
      )}

      {renderTable(
        "🔄 Most Shared Posts",
        topStats.topSharedPosts.map(p => ({
          id: p._id,
          user: p.user,
          content: p.content,
          metric: p.shares || 0
        })),
        "Shares"
      )}
    </div>
  );
};

export default TopStatsPanel;
