import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import PieCard from "../PieCard";

const WarningPieChart = () => {
  const { users } = useSelector((state: RootState) => state.adminUsers);

  const warn1 = users.filter((u) => u.isCountReport === 1).length;
  const warn2 = users.filter((u) => u.isCountReport === 2).length;
  const warn3 = users.filter((u) => u.isCountReport >= 3).length;
const warn0 = users.filter((u) => u.isCountReport === 0).length;
  const data = [
    { name: "Normal", value: warn0 },
    { name: "Warn 1", value: warn1 },
    { name: "Warn 2", value: warn2 },
    { name: "Banned", value: warn3 },
  ];

  return <PieCard title="⚠️ User Distribution by Warning Level" data={data} colors={["#facc15", "#fb923c", "#ef4444", "#60a5fa"]}  />;
};

export default WarningPieChart;
