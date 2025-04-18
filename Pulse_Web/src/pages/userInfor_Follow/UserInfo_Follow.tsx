import { useState, useEffect } from "react";
import { Share2, MessageSquare, Users, ArrowLeft, X } from "lucide-react";
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

const UserInfo_Follow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>(); // Lấy ID người dùng từ URL
  const userDetail = useSelector((state: RootState) => state.user.userDetails);
  const currentUser = useSelector((state: RootState) => state.auth.user?._id);
  const user = useSelector((state: RootState) => state.user);
  const { posts: userPosts } = useSelector((state: RootState) => state.postProfile);
  const followers = useSelector((state: RootState) => state.follow.followers);
  const followings = useSelector((state: RootState) => state.follow.followings);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State điều khiển việc hiển thị modal

  // Khi component mount, dispatch các actions để lấy thông tin người dùng, bài viết, followers và followings
  useEffect(() => {
    if (id) {
      dispatch(fetchUserPosts(id)); // Lấy bài viết của người dùng
      dispatch(fetchUserDetailById(id)); // Lấy chi tiết người dùng từ backend
      dispatch(getFollowers(id)); // Lấy thông tin followers
      dispatch(getFollowings(id)); // Lấy thông tin followings
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentUser && id) {
      dispatch(getFollowers(id))
        .then((res) => {
          const list = Array.isArray(res.payload) ? res.payload : [];
          const alreadyFollow = list.some((f) => f.user._id === currentUser);
          setIsFollowing(alreadyFollow);
        })
        .catch((error) => {
          console.error("❌ Error fetching followers:", error);
        });
    }
  }, [currentUser, id, dispatch]);

  // Xử lý khi nhấn nút follow/unfollow
  const handleFollowToggle = async () => {
    if (!user.userDetails || !id) return;

    const payload = {
      followingId: userDetail.userId,  // ID người bạn muốn theo dõi hoặc bỏ theo dõi
      followerId: currentUser!,  // ID người đang thực hiện hành động
    };

    // Kiểm tra xem người dùng đã follow chưa
    if (isFollowing) {
      const confirmUnfollow = window.confirm("Are you sure you want to unfollow this user?");
      if (!confirmUnfollow) return;

      // Dispatch action unfollowUser
      const result = await dispatch(unfollowUser(payload));
      if (unfollowUser.fulfilled.match(result)) {
        alert("Unfollowed successfully");
        setIsFollowing(false);  // Cập nhật trạng thái sau khi unfollow
        dispatch(getFollowers(id));  // Làm mới danh sách followers
        dispatch(getFollowings(id)); // Làm mới danh sách followings
      } else {
        alert("Failed to unfollow");
      }
    } else {
      // Dispatch action followUser
      const result = await dispatch(followUser(payload));
      if (followUser.fulfilled.match(result)) {
        alert("Followed successfully");
        setIsFollowing(true);  // Cập nhật trạng thái sau khi follow
        dispatch(getFollowers(id));  // Làm mới danh sách followers
        dispatch(getFollowings(id)); // Làm mới danh sách followings
      } else {
        alert("Failed to follow");
      }
    }
  };

  const handleUserClickInModal = (userId: string) => {
    if (userId === currentUser) {
      localStorage.setItem("activeItem", "My Profile"); // ✅ Update sidebar
      window.dispatchEvent(new Event("storage"));        // ✅ Kích hoạt cập nhật sidebar
      navigate("/home/my-profile");
    } else {
      navigate(`/home/user-info/${userId}`);
    }
  };


  // Hàm quay lại trang trước
  const handleBack = () => {
    localStorage.setItem("activeItem", "Home");
    window.dispatchEvent(new Event("storage"));
    navigate("/home");
  };

  // Nếu thông tin người dùng chưa được tải, hiển thị thông báo
  if (!userDetail) return <p className="text-white p-4">Đang tải thông tin người dùng...</p>;

  const fullName = `${userDetail.firstname} ${userDetail.lastname}`;
  const avatar = userDetail.avatar?.trim() || "https://i.pravatar.cc/300";
  const background = userDetail.backgroundAvatar || "https://picsum.photos/200";

  // Hàm mở modal khi bấm vào số lượng followers
  const handleFollowersClick = () => {
    setActiveTab("followers"); // Đặt tab mặc định là "followers"
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
        </div>
      </div>

      {/* Modal hiển thị followers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-black p-6 rounded-lg max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Tiêu đề */}
            <div className="mb-4 mt-8">
              <h2 className="text-xl font-semibold text-center text-white">{fullName}</h2>
            </div>

            {/* Các nút "Followers" và "Following" */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setActiveTab("followers")}
                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${activeTab === "followers" ? "text-white border-b-2 border-white" : "text-gray-400"
                  }`}
              >
                Followers
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${activeTab === "following" ? "text-white border-b-2 border-white" : "text-gray-400"
                  }`}
              >
                Following
              </button>
            </div>

            {/* ✅ DANH SÁCH CÓ SCROLL */}
            <div className="max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
              {activeTab === "followers" ? (
                followers.length === 0 ? (
                  <p className="text-center text-gray-500">Không có followers nào.</p>
                ) : (
                  <ul>
                    {followers.map((follower, index) => (
                      <li
                        key={index}
                        onClick={() => handleUserClickInModal(follower.user._id)}
                        className="flex justify-between items-center py-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={follower.user.avatar || "https://i.pravatar.cc/150"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{`${follower.user.firstname} ${follower.user.lastname}`}</span>
                        </div>
                        <button className="text-blue-500">Friend</button>
                      </li>
                    ))}
                  </ul>
                )
              ) : followings.length === 0 ? (
                <p className="text-center text-gray-500">Không có following nào.</p>
              ) : (
                <ul>
                  {followings.map((following, index) => (
                    <li
                      key={index}
                      onClick={() => handleUserClickInModal(following.user._id)}
                      className="flex justify-between items-center py-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={following.user.avatar || "https://i.pravatar.cc/150"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{`${following.user.firstname} ${following.user.lastname}`}</span>
                      </div>
                      <button className="text-blue-500">Friend</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
