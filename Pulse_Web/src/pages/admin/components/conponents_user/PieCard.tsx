import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PieCardProps {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
}

const PieCard = ({ title, data, colors }: PieCardProps) => (
  <div className="bg-zinc-900 rounded-lg p-4 shadow-md w-full max-w-[300px] text-white">
    <h3 className="text-sm font-semibold mb-2 text-center">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={80}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
         <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieCard;
