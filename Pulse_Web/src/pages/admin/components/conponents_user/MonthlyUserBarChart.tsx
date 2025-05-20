import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const MonthlyUserBarChart = () => {
    const { users } = useSelector((state: RootState) => state.adminUsers);

    const getLast5Months = () => {
        const now = new Date();
        const months: { key: string; count: number; }[] = [];

        for (let i = 4; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
            months.push({ key, count: 0 });
        }

        users.forEach((user) => {
            const createdDate = new Date(user.createdAt);
            const createdKey = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
            const monthData = months.find((m) => m.key === createdKey);
            if (monthData) monthData.count += 1;
        });

        return months;
    };

    const chartData = getLast5Months();

    return (
        <div className="bg-zinc-900 rounded-lg p-4 shadow-md text-white mt-6">
            <h3 className="text-lg font-semibold mb-3">📅 Số lượng đăng ký theo tháng (5 tháng gần nhất)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis
                        allowDecimals={false}
                        domain={[0, 'auto']}
                        tickCount={6}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" />
                    <legend />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyUserBarChart;
