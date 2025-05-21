import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchPostStatistics } from "../../../redux/slice/postProfileSlice";
import OverviewPanel from "./components_post/OverviewPanel";
import TopStatsPanel from "./components_post/TopStatsPanel";

const AdminPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => state.postProfile.statistics);
  const loading = useSelector((state: RootState) => state.postProfile.loading);
  const [activeTab, setActiveTab] = useState<"overview" | "topStats">("overview");

  useEffect(() => {
    dispatch(fetchPostStatistics());
  }, [dispatch]);

  if (loading || !stats) return <p className="text-white p-6">⏳ Loading statistics...</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl ${
            activeTab === "overview"
              ? "bg-blue-500 text-white cursor-pointer"
              : "bg-gray-200 text-gray-700 cursor-pointer"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("topStats")}
          className={`px-4 py-2 rounded-xl ${
            activeTab === "topStats"
              ? "bg-blue-500 text-white cursor-pointer"
              : "bg-gray-200 text-gray-700 cursor-pointer"
          }`}
        >
          Top Stats
        </button>
      </div>

      {/* Use tách riêng component */}
      {activeTab === "overview" && <OverviewPanel stats={stats} />}
      {activeTab === "topStats" && <TopStatsPanel/>}
    </div>
  );
};

export default AdminPosts;
