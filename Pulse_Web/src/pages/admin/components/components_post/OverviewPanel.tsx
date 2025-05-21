import { Card, CardContent } from "../Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PostStatistics } from "../../../../redux/slice/postProfileSlice";

interface Props {
  stats: PostStatistics;
}

const OverviewPanel = ({ stats }: Props) => {
  return (
    <>
      {/* Tổng quan chỉ số */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 bg-zinc-800 text-white rounded-xl">
            <p className="text-sm text-zinc-400">Total Posts</p>
            <p className="text-xl font-semibold text-blue-400">{stats.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-zinc-800 text-white rounded-xl">
            <p className="text-sm text-zinc-400">Today</p>
            <p className="text-xl font-semibold text-pink-400">{stats.todayPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-zinc-800 text-white rounded-xl">
            <p className="text-sm text-zinc-400">Reported</p>
            <p className="text-xl font-semibold text-red-400">{stats.reportedPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-zinc-800 text-white rounded-xl">
            <p className="text-sm text-zinc-400">Hidden</p>
            <p className="text-xl font-semibold text-yellow-300">{stats.hiddenPosts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="bg-zinc-800 rounded-2xl p-4 shadow mt-6 text-white">
        <h2 className="text-lg font-semibold mb-4 text-blue-400">🗓 Posts over last 7 days</h2>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={stats.postTrend}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng recent posts */}
      <div className="bg-zinc-800 rounded-2xl p-4 shadow mt-6 text-white">
        <h2 className="text-lg font-medium mb-4 text-blue-400">📋 Recent Posts</h2>
        <div className="overflow-y-auto border border-zinc-700 rounded-lg" style={{ maxHeight: 'calc(5 * 41px)' }}>
          <table className="w-full text-sm text-left text-zinc-100">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-700 sticky top-0 z-4">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Content</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPosts.map((post, index) => (
                <tr key={post._id} className="border-b border-zinc-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{post.username}</td>
                  <td className="px-4 py-2 truncate max-w-[200px]">{post.content}</td>
                  <td className="px-4 py-2">
                    {post.status === "reported" ? (
                      <span className="text-red-400">{post.status}</span>
                    ) : post.status === "hidden" ? (
                      <span className="text-yellow-300">{post.status}</span>
                    ) : (
                      <span className="text-green-400">{post.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OverviewPanel;
