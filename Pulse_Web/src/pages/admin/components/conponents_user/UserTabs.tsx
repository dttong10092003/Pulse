

interface Props {
  activeTab: "overview" | "topDetail";
  setActiveTab: (tab: "overview" | "topDetail") => void;
}

const UserTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="flex gap-4 mb-6 p-2">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-transform transform hover:scale-105 shadow-md
          ${activeTab === "overview"
            ? "bg-indigo-600 text-white"
            : "bg-zinc-700 text-white hover:bg-zinc-600"}`}
      >
        Overview
      </button>

      <button
        onClick={() => setActiveTab("topDetail")}
        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-transform transform hover:scale-105 shadow-md
          ${activeTab === "topDetail"
            ? "bg-indigo-600 text-white"
            : "bg-zinc-700 text-white hover:bg-zinc-600"}`}
      >
        Top Detail
      </button>
    </div>
  );
};

export default UserTabs;
