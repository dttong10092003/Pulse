import GenderPieChart from "./PieChart/GenderPieChart";
import BanStatusPieChart from "./PieChart/BanStatusPieChart";
import WarningPieChart from "./PieChart/WarningPieChart";

const TopDetail = () => {
  return (
    <div className="w-full flex flex-wrap justify-center gap-4">
      <GenderPieChart />
      <BanStatusPieChart />
      <WarningPieChart />
    </div>
  );
};

export default TopDetail;
