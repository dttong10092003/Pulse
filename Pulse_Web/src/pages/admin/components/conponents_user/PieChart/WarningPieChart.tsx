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
    { name: "Cảnh cáo 1", value: warn1 },
    { name: "Cảnh cáo 2", value: warn2 },
    { name: "Cảnh cáo ≥3", value: warn3 },
    { name: "Chưa cảnh cáo", value: warn0 },
  ];

  return <PieCard title="⚠️ Số lần cảnh cáo" data={data} colors={["#facc15", "#fb923c", "#ef4444", "#60a5fa"]}  />;
};

export default WarningPieChart;
