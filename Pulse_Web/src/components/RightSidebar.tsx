const RightSidebar = ({ isDark }: { isDark: boolean }) => {
    const usersToFollow = [
      { name: "linh võ", username: "tranlinhtt", avatar: "https://picsum.photos/200" },
      { name: "Anh Tuấn", username: "tuandha", avatar: "https://picsum.photos/200" },
      { name: "Do Quang Hop", username: "hicaunha", avatar: "https://picsum.photos/200" },
      { name: "cc 3m", username: "cc3m", avatar: "https://picsum.photos/200" },
      { name: "ku ku", username: "hxuan123", avatar: "https://picsum.photos/200" },
      { name: "Ahaha Ahaha", username: "Ahaha", avatar: "https://picsum.photos/200" },
      { name: "Nghia Tran", username: "nghiatran0502", avatar: "https://picsum.photos/200" },
      { name: "200Lab Technology", username: "200Lab", avatar: "https://picsum.photos/200" },
    ];
  
    return (
      <aside className={`w-80 p-4 ${isDark ? "bg-[#1F1F1F] text-white" : "bg-white text-black"}`}>
        <div className="sticky top-0 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Who to follow</h2>
          </div>
          <div className="space-y-4">
            {usersToFollow.map((user, index) => (
              <UserSuggestion key={index} {...user} isDark={isDark} />
            ))}
          </div>
        </div>
      </aside>
    );
  };
  
  const UserSuggestion = ({
    name,
    username,
    avatar,
    isDark,
  }: {
    name: string;
    username: string;
    avatar: string;
    isDark: boolean;
  }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={avatar || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className={isDark ? "text-zinc-500" : "text-gray-600"}>@{username}</p>
          </div>
        </div>
        <button className={isDark ? "bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-full text-sm font-semibold transition" : "bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition"}>
          Follow
        </button>
      </div>
    );
  };
  
  export default RightSidebar;
