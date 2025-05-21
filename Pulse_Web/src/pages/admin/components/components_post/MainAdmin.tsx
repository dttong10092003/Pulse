import OverviewPanel from "./OverviewPanel";
import TopStatsPanel from "./TopStatsPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const MainAdmin = () => {
  const stats = useSelector((state: RootState) => state.postProfile.statistics); // ✅ lấy từ slice

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-100">
      {/* Header cố định */}
      <header className="p-4 bg-white shadow text-lg font-semibold text-zinc-700 shrink-0">
        📊 Admin Dashboard
      </header>

      {/* Nội dung cuộn */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {stats && <OverviewPanel stats={stats} />}
        <TopStatsPanel />
        <TopStatsPanel />
        <TopStatsPanel />
      </main>
    </div>
  );
};

export default MainAdmin;
