import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import PieCard from "../PieCard";

const BanStatusPieChart = () => {
  const { users } = useSelector((state: RootState) => state.adminUsers);

  const active = users.filter((u) => u.isActive).length;
  const banned = users.filter((u) => !u.isActive).length;

  const data = [
    { name: "Hoạt động", value: active },
    { name: "Bị khóa", value: banned },
  ];

  return <PieCard title="🚫 Trạng thái tài khoản" data={data} colors={["#22c55e", "#ef4444"]} />;
};

export default BanStatusPieChart;
