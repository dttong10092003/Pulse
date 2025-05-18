// src/pages/admin/components/OverviewPanel.tsx
import { Card, CardContent } from "./Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PostStatistics } from "../../../redux/slice/postProfileSlice"; // hoặc import từ redux nếu đã define ở slice

interface Props {
  stats: PostStatistics;
}

const OverviewPanel = ({ stats }: Props) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Total Posts</p><p className="text-xl font-semibold text-blue-500">{stats.totalPosts}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Today</p><p className="text-xl font-semibold text-pink-500">{stats.todayPosts}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Reported</p><p className="text-xl font-semibold text-red-500">{stats.reportedPosts}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-zinc-400">Hidden</p><p className="text-xl font-semibold text-yellow-400">{stats.hiddenPosts}</p></CardContent></Card>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-4 text-red-500">🗓 Posts over last 7 days</h2>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={stats.postTrend}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <h2 className="text-lg font-medium mb-4 text-red-500">📋 Recent Posts</h2>
        <div className="overflow-y-auto border rounded-lg" style={{ maxHeight: 'calc(5 * 41px)' }}>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-500 uppercase bg-gray-100 sticky top-0 z-4">
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
                <tr key={post._id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{post.username}</td>
                  <td className="px-4 py-2 truncate max-w-[200px]">{post.content}</td>
                  <td className="px-4 py-2">
                    {post.status === "reported" ? (
                      <span className="text-red-500">{post.status}</span>
                    ) : post.status === "hidden" ? (
                      <span className="text-yellow-500">{post.status}</span>
                    ) : (
                      post.status
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
