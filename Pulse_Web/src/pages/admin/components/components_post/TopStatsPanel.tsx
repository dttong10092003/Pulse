import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchTopStats } from "../../../../redux/slice/postProfileSlice";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57'];

const TopStatsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const topStats = useSelector((state: RootState) => state.postProfile.topStats);
  const loadingTopStats = useSelector((state: RootState) => state.postProfile.loadingTopStats);

  useEffect(() => {
    if (!topStats) {
      dispatch(fetchTopStats());
    }
  }, [dispatch, topStats]);

  const aggregateByUser = (
    data: { user: string; metric: number }[]
  ): { user: string; metric: number }[] => {
    const result: Record<string, number> = {};
    data.forEach(({ user, metric }) => {
      if (!result[user]) result[user] = 0;
      result[user] += metric;
    });
    return Object.entries(result).map(([user, metric]) => ({ user, metric }));
  };

  const renderTableAndChart = (
    title: string,
    data: { id: string; user: string; content: string; metric: number }[],
    metricLabel: string
  ) => {
    const pieData = aggregateByUser(data.map(({ user, metric }) => ({ user, metric })));

    return (
      <div className="bg-zinc-800 rounded-2xl p-4 shadow mb-5 flex flex-col md:flex-row gap-4 text-white">
        {/* Bảng */}
        <div className="md:w-2/3 w-full overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">{title}</h3>
          <table className="w-full text-sm text-left text-zinc-200">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-700">
              <tr>
                <th className="w-[10%] px-2 py-2">STT</th>
                <th className="w-[30%] px-2 py-2">User</th>
                <th className="w-[55%] px-2 py-2">Content</th>
                <th className="w-[5%] px-2 py-2">{metricLabel}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((post, index) => (
                <tr key={`${post.id}-${index}`} className="border-b border-zinc-700" style={{ height: '25px' }}>
                  <td className="px-2">{index + 1}</td>
                  <td className="px-2">{post.user}</td>
                  <td className="px-2 truncate max-w-[250px]">{post.content}</td>
                  <td className="px-2 font-medium text-right">{post.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Biểu đồ */}
        <div className="md:w-1/3 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="metric"
                nameKey="user"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent, name }) => (percent > 0.05 ? name : "")}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (loadingTopStats || !topStats) {
    return (
      <div className="text-white bg-zinc-900 p-6 rounded-xl shadow">
        ⏳ Loading top stats...
      </div>
    );
  }

  return (
    <div className="text-white mt-1">
      {renderTableAndChart(
        "🔥 Most Liked Posts",
        topStats.topLikedPosts.map(p => ({
          id: p._id,
          user: p.user,
          content: p.content,
          metric: p.likes || 0
        })),
        "Likes"
      )}

      {renderTableAndChart(
        "💬 Most Commented Posts",
        topStats.topCommentedPosts.map(p => ({
          id: p._id,
          user: p.user,
          content: p.content,
          metric: p.comments || 0
        })),
        "Comments"
      )}

      {renderTableAndChart(
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
