import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store"; // Thêm RootState và AppDispatch
import {
  followUser,
  unfollowUser,
  getFollowers,
} from "../../redux/slice/followSlice";
import { fetchUserPosts } from "../../redux/slice/postProfileSlice";

// Định nghĩa các kiểu dữ liệu trong Redux
interface RootState {
  auth: {
    user: {
      _id: string;
      username: string;
    } | null;
    token: string | null;
    userDetail: {
      _id: string;
      firstname: string;
      lastname: string;
      bio: string;
      avatar: string;
      backgroundAvatar: string;
    } | null;
  };
  postProfile: {
    posts: { content: string; time: string; likes: number; comments: number }[];
    count: number;
  };
  follow: {
    followers: { followerId: string }[];
    followings: { followingId: string }[];
  };
}

const UserInfo_Follow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();  // Sử dụng AppDispatch cho dispatch
  const { followers } = useSelector((state: RootState) => state.follow); // Lấy dữ liệu từ Redux
  const auth = useSelector((state: RootState) => state.auth);
  const { posts: userPosts } = useSelector(
    (state: RootState) => state.postProfile
  );  

  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);

  // Dữ liệu người dùng
  const profileData = {
    _id: "6611e1a93ad4eeb6a123456", // ID người được xem profile
    username: "200Lab Guest",
    handle: "@guest",
    bio: "Hello",
    stats: {
      posts: 170,
      status: "sad",
    },
  };

  // Fetch bài đăng của người dùng khi ID người dùng thay đổi
  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchUserPosts(auth.user._id)); // Gọi action lấy bài đăng của người dùng
    }
  }, [dispatch, auth.user?._id]);

  // Kiểm tra xem người dùng có đang theo dõi hay không
  useEffect(() => {
    if (auth.user?._id && profileData._id) {
      dispatch(getFollowers(profileData._id)).then((res) => {
        const list = (res.payload ?? []) as { followerId: string }[];
        const alreadyFollow = list.some(
          (f) => f.followerId === auth.user?._id
        );
        setIsFollowing(alreadyFollow);
      });
    }
  }, [auth.user?._id, profileData._id, dispatch]);

  const handleBack = () => {
    localStorage.setItem("activeItem", "Home");
    window.dispatchEvent(new Event("storage"));
    navigate("/home");
  };

  const handleFollowToggle = async () => {
    if (!auth.token || !profileData._id) return;

    const payload = {
      followingId: profileData._id,
      token: auth.token,
    };

    if (isFollowing) {
      await dispatch(unfollowUser(payload));
    } else {
      await dispatch(followUser(payload));
    }

    // Cập nhật lại followers
    dispatch(getFollowers(profileData._id));
    setIsFollowing(!isFollowing);
  };

  return (
    <main className="bg-[#1F1F1F] text-white">
      {/* Header */}
      <div
        className="relative w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/200')" }}
      >
        <div className="absolute inset-0 bg-black/50 " />
        <button
          className="absolute hover:bg-white/20 top-4 left-4 p-3 rounded-full transition text-white cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="relative px-4 -mt-16 flex flex-col items-start">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/300"
            alt="Avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>

        <div className="mt-4 flex items-center justify-between w-full">
          <div>
            <h2 className="text-2xl font-bold">{profileData.username}</h2>
            <p className="text-zinc-500">{profileData.handle}</p>
            <p className="text-zinc-400 mt-2">{profileData.bio}</p>
          </div>

          <button
            className="text-white px-4 py-2 bg-zinc-700 rounded-full hover:bg-zinc-800 cursor-pointer"
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between w-full text-zinc-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer">
              <MessageSquare size={18} /> {profileData.stats.posts} posts
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Users size={18} /> {followers.length} followers
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Share2 size={18} /> {profileData.stats.status}
            </span>
          </div>
          <button
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-600 cursor-pointer"
            onClick={() => navigate("/home/edit-profile")}
          >
            <UserRoundPen size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mt-4 bg-[#181818] p-1 rounded-full">
        {["Posts", "Featured", "Media"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === tab ? "bg-zinc-800 text-white" : "text-zinc-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "Posts" && (
          <Posts posts={userPosts} username={profileData.username} />
        )}
        {activeTab === "Featured" && <Featured />}
        {activeTab === "Media" && <Media />}
      </div>
    </main>
  );
};

export default UserInfo_Follow;
