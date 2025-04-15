import { useState, useEffect } from "react";
import { Share2, MessageSquare, Users, UserRoundPen, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
} from "../../redux/slice/followSlice";
import { fetchUserDetailById } from "../../redux/slice/userSlice";
import { fetchUserPosts } from "../../redux/slice/postProfileSlice";
import { X } from "lucide-react";

const UserInfo_Follow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();  // Lấy ID người dùng từ URL
  const userDetail = useSelector((state: RootState) => state.user.userDetails);
  const user = useSelector((state: RootState) => state.user);
  const { posts: userPosts } = useSelector((state: RootState) => state.postProfile);
  const { followers, followings } = useSelector((state: RootState) => state.follow);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State điều khiển việc hiển thị modal

  console.log("ID từ URL:", id); // Kiểm tra ID trong URL
  useEffect(() => {
    if (id) {
      dispatch(fetchUserPosts(id));  // Lấy bài viết của người dùng
      dispatch(fetchUserDetailById(id));  // Lấy chi tiết người dùng từ backend
      dispatch(getFollowers(id)); // Lấy followers
      dispatch(getFollowings(id)); // Lấy followings
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user.userDetails?._id && id) {
      dispatch(getFollowers(id)).then((res) => {
        const list = (res.payload ?? []) as { followerId: string }[];
        const alreadyFollow = list.some((f) => f.followerId === user.userDetails?._id);
        setIsFollowing(alreadyFollow);
      });
    }
  }, [user.userDetails?._id, id, dispatch]);

  const handleFollowToggle = async () => {
    if (!user.userDetails || !id) return;

    const payload = {
      followingId: id,
      token: user.userDetails,
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

  if (!userDetail) return <p className="text-white p-4">Đang tải thông tin người dùng...</p>;
  const fullName = `${userDetail.firstname} ${userDetail.lastname}`;
  const handle = `@${userDetail.username}`;
  const avatar = userDetail.avatar?.trim() || "https://i.pravatar.cc/300";
  const background = userDetail.backgroundAvatar || "https://picsum.photos/200";

  // Hàm mở modal khi bấm vào số lượng followers
  const handleFollowersClick = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="bg-[#1F1F1F] text-white">
      {/* Header của trang hồ sơ */}

      <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="absolute inset-0 bg-black/50 " />
        <button className="absolute hover:bg-white/20 top-4 left-4 p-3 rounded-full transition text-white cursor-pointer" onClick={handleBack}>
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

          <button className="text-white px-4 py-2 bg-zinc-700 rounded-full hover:bg-zinc-800 cursor-pointer" onClick={handleFollowToggle}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between w-full text-zinc-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer">
              <MessageSquare size={18} /> {userPosts.length} bài viết
            </span>
            <span
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleFollowersClick} // Thêm sự kiện mở modal khi bấm vào followers
            >
              <Users size={18} /> {followers.length} followers
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Share2 size={18} />
            </span>
          </div>
          <button className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-zinc-600 cursor-pointer" onClick={() => navigate("/home/edit-profile")}>
            <UserRoundPen size={18} />
          </button>
        </div>
      </div>

      {/* Modal hiển thị followers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <button onClick={closeModal} className="text-white">
                <X size={24} /> {/* Icon X có kích thước 24 */}
              </button>
            </div>
            {/* Các nút "Followers" và "Following" */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setActiveTab("followers")}
                className={`font-semibold flex-1 py-2 text-center text-sm rounded-full cursor-pointer ${activeTab === "followers" ? " text-white" : " text-gray-400"
                  }`}
              >
                Followers
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`font-semibold flex-1 py-2 text-center text-sm rounded-full cursor-pointer ${activeTab === "following" ? "text-white" : "text-gray-400"
                  }`}
              >
                Following
              </button>
            </div>

            {/* Hiển thị dữ liệu tùy theo tab được chọn */}
            {activeTab === "followers" ? (
              followers.length === 0 ? (
                <p className="text-center text-gray-500">Không có followers nào.</p>
              ) : (
                <ul>
                  {followers.map((follower, index) => (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span className="text-white">{follower.followerId}</span> {/* Hiển thị tên hoặc id của follower */}
                      <button className="text-blue-500">Bạn bè</button>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              followings.length === 0 ? (
                <p className="text-center text-gray-500">Không có following nào.</p>
              ) : (
                <ul>
                  {followings.map((following, index) => (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span className="text-white">{following.followingId}</span> {/* Hiển thị tên hoặc id của following */}
                      <button className="text-blue-500">Bạn bè</button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      )}

      {/* Các tab: Bài viết, Nổi bật, Media */}
      <div className="flex mt-4 bg-[#181818] p-1 rounded-full">
        {["Posts", "Featured", "Media"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${activeTab === tab ? "bg-zinc-800 text-white" : "text-zinc-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="mt-4">
        {activeTab === "Posts" && (
          <Posts posts={userPosts} username={fullName} />
        )}
        {activeTab === "Featured" && <Featured />}
        {activeTab === "Media" && <Media />}
      </div>
    </main>
  );
};

export default UserInfo_Follow;
