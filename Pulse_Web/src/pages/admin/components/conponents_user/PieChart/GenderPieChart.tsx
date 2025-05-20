import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import PieCard from "../PieCard";

const GenderPieChart = () => {
  const { users } = useSelector((state: RootState) => state.adminUsers);

  const male = users.filter((u) => u.gender === "male").length;
  const female = users.filter((u) => u.gender === "female").length;

  const data = [
    { name: "Nam", value: male },
    { name: "Nữ", value: female },
  ];

  return <PieCard title="👨‍🦱 Tỉ lệ giới tính" data={data} colors={["#8884d8", "#ff6384"]} />;
};

export default GenderPieChart;
