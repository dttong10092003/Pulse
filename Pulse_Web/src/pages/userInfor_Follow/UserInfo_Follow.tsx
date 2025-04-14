import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  followUser,
  unfollowUser,
  getFollowers,
} from "../../redux/slice/followSlice";
import { fetchUserPosts } from "../../redux/slice/postProfileSlice";
import { fetchUserDetailById } from "../../redux/slice/userSlice";

const UserInfo_Follow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();  // Lấy ID từ URL
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const auth = useSelector((state: RootState) => state.auth);
  const { posts: userPosts } = useSelector((state: RootState) => state.postProfile);
  const { followers } = useSelector((state: RootState) => state.follow);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserPosts(id));  // Lấy bài viết của người dùng
      dispatch(fetchUserDetailById(id)); // Lấy chi tiết người dùng từ backend
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (auth.user?._id && id) {
      dispatch(getFollowers(id)).then((res) => {
        const list = (res.payload ?? []) as { followerId: string }[];
        const alreadyFollow = list.some((f) => f.followerId === auth.user?._id);
        setIsFollowing(alreadyFollow);
      });
    }
  }, [auth.user?._id, id, dispatch]);
  
  const handleFollowToggle = async () => {
    if (!auth.token || !id) return;
  
    const payload = {
      followingId: id,
      token: auth.token,
    };
  
    if (isFollowing) {
      await dispatch(unfollowUser(payload));
    } else {
      await dispatch(followUser(payload));
    }
  
    dispatch(getFollowers(id));
    setIsFollowing(!isFollowing);
  };

  const handleBack = () => {
    localStorage.setItem("activeItem", "Home");
    window.dispatchEvent(new Event("storage"));
    navigate("/home");
  };

  if (!userDetail) return <p className="text-white p-4">Loading user info...</p>;

  const fullName = `${userDetail.firstname} ${userDetail.lastname}`;
  const handle = `@${userDetail.username}`;
  const avatar = userDetail.avatar?.trim() || "https://i.pravatar.cc/300";
  const background = userDetail.backgroundAvatar || "https://picsum.photos/200";

  return (
    <main className="bg-[#1F1F1F] text-white">
      <div
        className="relative w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/50 " />
        <button
          className="absolute hover:bg-white/20 top-4 left-4 p-3 rounded-full transition text-white cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <div className="relative px-4 -mt-16 flex flex-col items-start">
        <div className="flex items-center gap-4">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
        </div>

        <div className="mt-4 flex items-center justify-between w-full">
          <div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-zinc-500">{handle}</p>
            <p className="text-zinc-400 mt-2">{userDetail.bio}</p>
          </div>

          <button
            className="text-white px-4 py-2 bg-zinc-700 rounded-full hover:bg-zinc-800 cursor-pointer"
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between w-full text-zinc-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer">
              <MessageSquare size={18} /> {userPosts.length} posts
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Users size={18} /> {followers.length} followers
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Share2 size={18} />
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

      <div className="mt-4">
        {activeTab === "Posts" && (
          <Posts posts={userPosts} username={fullName}  />
        )}
        {activeTab === "Featured" && <Featured />}
        {activeTab === "Media" && <Media />}
      </div>
    </main>
  );
};

export default UserInfo_Follow;
