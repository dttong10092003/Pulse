import { useState, useEffect } from "react";
import { Share2, MessageSquare, Users, ArrowLeft, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Posts, Featured, Media } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { io } from "socket.io-client";  // Kết nối WebSocket
// import { createNotification } from "../../redux/slice/notificationSlice"; // Import action createNotification
const URL_NOTI = import.meta.env.VITE_API_URL_NOTI; // Địa chỉ WebSocket
const socket = io(URL_NOTI);
import '../../global.css'

import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
} from "../../redux/slice/followSlice";
import { fetchUserDetailById, getTopUsersExcludingFollowed } from "../../redux/slice/userSlice";
import { fetchUserPosts } from "../../redux/slice/postProfileSlice";
import { FollowItem } from "../../redux/slice/followSlice";
import { getFollowingsByUserId } from "../../redux/slice/followSlice";
import axios from "axios";
import api from "../../services/api";
import { getUserDetails } from "../../redux/slice/userSlice";
const UserInfo_Follow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const userDetail = useSelector((state: RootState) => state.user.userDetails);
  const currentUser = useSelector((state: RootState) => state.auth.user?._id);
  // const user = useSelector((state: RootState) => state.user);
  const { posts: userPosts } = useSelector((state: RootState) => state.postProfile);
  const followers = useSelector((state: RootState) => state.follow.followers);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileTab, setProfileTab] = useState("Posts"); // Dành cho Posts/Featured/Media
  const [modalTab, setModalTab] = useState<"followers" | "following">("followers"); // Dành cho modal
  const [userFollowings, setUserFollowings] = useState<FollowItem[]>([]);
  const URL_NOTI = import.meta.env.VITE_API_URL_NOTI; // Địa chỉ WebSocket
  const [profileUser, setProfileUser] = useState<any>(null);
  const userShowId = profileUser?.userId || '';
  const userLoginId = currentUser;// id user đang login 
  const commentCounts = useSelector((state: RootState) => state.comments.commentCounts);
  const [likeModalOpen, setLikeModalOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);


  const handleHoldLike = async (postId: string) => {
    try {
      setIsLoadingLikes(true);

      const res = await api.get(`/likes/${postId}`); // [{ userId, timestamp }]
      const likeList = res.data;

      const userDetails: any[] = [];

      for (const like of likeList) {
        try {
          const user = await dispatch(getUserDetails(like.userId)).unwrap();
          userDetails.push({
            ...user,
            timestamp: like.timestamp
          });
        } catch (err) {
          console.error("❌ Lỗi fetch userId:", like.userId, err);
        }
      }

      setLikedUsers(userDetails);
      setLikeModalOpen(true);
    } catch (err) {
      console.error("🔥 Lỗi lấy danh sách like:", err);
    } finally {
      setIsLoadingLikes(false);
    }
  };


  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetailById(id)).then((res) => {
        if (fetchUserDetailById.fulfilled.match(res)) {
          setProfileUser(res.payload);  // 🔥 dùng local state, không dùng store nữa
        }
      });
      dispatch(fetchUserPosts(id));
      dispatch(getFollowers(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (modalTab === "following" && id) {
      dispatch(getFollowingsByUserId(id)).then((res) => {
        if (Array.isArray(res.payload)) {
          setUserFollowings(res.payload);
        }
      });
    }
  }, [modalTab, id, dispatch]);

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


  useEffect(() => {
    // Khi người dùng A follow người dùng B, B sẽ nhận thông báo
    socket.on("new_notification", (notification) => {
      if (notification.type === "follow" && notification.receiverId === userLoginId) {
        alert(`${notification.senderId} followed you!`);  // Hiển thị thông báo

      }
    });

    return () => {
      socket.off("new_notification");  // Cleanup socket listener khi component unmount
    };
  }, [currentUser]);



  const handleSendNotification = async () => {
    try {
      const senderId = userLoginId;
      const receiverIds: string[] = [userShowId];

      await axios.post(`${URL_NOTI}/noti/create`, {
        type: "follow",
        senderId,
        receiverIds,
        messageContent: "",
        postId: "",
        commentContent: "",
      });

      // alert('Gửi thông báo thành công!');

    } catch (err) {
      console.error('Gửi thông báo thất bại', err);
      alert('Gửi thông báo thất bại!');
    }
  };
  // const handleFollowToggle = async () => {
  //   handleSendNotification();
  // }


  const handleFollowToggle = async () => {
    if (!userDetail || !currentUser || !id) return;

    const payload = {
      followingId: userDetail.userId,
      followerId: currentUser!,
    };

    if (isFollowing) {
      const confirmUnfollow = window.confirm("Are you sure you want to unfollow this user?");
      if (!confirmUnfollow) return;

      const result = await dispatch(unfollowUser(payload));
      if (unfollowUser.fulfilled.match(result)) {
        alert("Unfollowed successfully");
        setIsFollowing(false);
        dispatch(getFollowers(id));
        dispatch(getFollowings(currentUser));
        dispatch(getTopUsersExcludingFollowed(currentUser!));
      } else {
        alert("Failed to unfollow");
      }
    } else {
      const result = await dispatch(followUser(payload));
      if (followUser.fulfilled.match(result)) {
        alert("Followed successfully");
        setIsFollowing(true);
        dispatch(getFollowers(id));
        dispatch(getFollowings(currentUser));
        dispatch(getTopUsersExcludingFollowed(currentUser!));


        // Gửi thông báo cho người dùng được follow
        handleSendNotification();

      } else {
        alert("Failed to follow");
      }
    }
  };

  const handleUserClickInModal = (userId: string) => {
    if (userId === currentUser) {
      localStorage.setItem("activeItem", "My Profile");
      window.dispatchEvent(new Event("storage"));
      navigate("/home/my-profile");
    } else {
      navigate(`/home/user-info/${userId}`);
    }
  };

  const handleBack = () => {
    localStorage.setItem("activeItem", "Home");
    window.dispatchEvent(new Event("storage"));
    navigate("/home");
  };

  if (!userDetail) return <p className="text-white p-4">Đang tải thông tin người dùng...</p>;

  const fullName = `${profileUser?.firstname} ${profileUser?.lastname}`;
  const avatar = profileUser?.avatar?.trim() || "https://i.pravatar.cc/300";
  const background = profileUser?.backgroundAvatar || "https://picsum.photos/200";


  const handleFollowersClick = () => {
    setModalTab("followers");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="bg-[#1F1F1F] text-white">
      <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <div className="absolute inset-0 bg-black/50" />
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
              <MessageSquare size={18} /> {userPosts.length} posts
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={handleFollowersClick}>
              <Users size={18} /> {followers.length} followers
            </span>
            <span className="flex items-center gap-1 cursor-pointer">
              <Share2 size={18} />
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-black p-6 rounded-lg max-w-sm w-full relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-white cursor-pointer">
              <X size={24} />
            </button>
            <div className="mb-4 mt-8">
              <h2 className="text-xl font-semibold text-center text-white">{fullName}</h2>
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setModalTab("followers")}
                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${modalTab === "followers" ? "text-white border-b-2 border-white" : "text-gray-400"
                  }`}
              >
                Followers
              </button>
              <button
                onClick={() => setModalTab("following")}
                className={`font-semibold flex-1 py-2 text-center text-sm cursor-pointer ${modalTab === "following" ? "text-white border-b-2 border-white" : "text-gray-400"
                  }`}
              >
                Following
              </button>
            </div>
            <div className="max-h-[25vh] overflow-y-auto scrollbar-dark">
              {modalTab === "followers" ? (
                followers.length === 0 ? (
                  <p className="text-center text-gray-500">Không có followers nào.</p>
                ) : (
                  <ul>
                    {followers.map((follower, index) => (
                      <li key={index} onClick={() => handleUserClickInModal(follower.user._id)} className="flex justify-between items-center py-2 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img src={follower.user.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
                          <span>{`${follower.user.firstname} ${follower.user.lastname}`}</span>
                        </div>
                        <button className="text-blue-500">Friend</button>
                      </li>
                    ))}
                  </ul>
                )
              ) : userFollowings.length === 0 ? (
                <p className="text-center text-gray-500">Không có following nào.</p>
              ) : (
                <ul>
                  {userFollowings.map((following, index) => (
                    <li key={index} onClick={() => handleUserClickInModal(following.user._id)} className="flex justify-between items-center py-2 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <img src={following.user.avatar || "https://i.pravatar.cc/150"} className="w-8 h-8 rounded-full object-cover" />
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

      <div className="flex mt-4 bg-[#181818] p-1 rounded-full">
        {["Posts", "Featured", "Media"].map((tab) => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            className={`flex-1 py-3 text-center font-semibold rounded-full transition-all cursor-pointer ${profileTab === tab ? "bg-zinc-800 text-white" : "text-zinc-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* {profileTab === "Posts" && (
          <div className="max-h-[65vh] overflow-y-auto scrollbar-dark px-2">
          
            <Posts posts={userPosts} username={fullName} avatar={avatar} commentCounts={commentCounts}/>
          </div>
        )} */}
        {profileTab === "Posts" && (
          <div className="max-h-[65vh] overflow-y-auto scrollbar-dark px-2">
            {userPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-zinc-400 py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A7.5 7.5 0 0112 3a7.5 7.5 0 016.879 14.804M15 12l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg">No posts found!</p>
              </div>
            ) : (
              <Posts posts={userPosts} username={fullName} avatar={avatar} commentCounts={commentCounts} onHoldLike={handleHoldLike} />
            )}
          </div>
        )}

        {profileTab === "Featured" && <Featured />}
        {profileTab === "Media" && <Media />}
      </div>
      {likeModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setLikeModalOpen(false)}>
          <div className="bg-zinc-900 p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4 text-white text-center">
              People who liked the post ({likedUsers.length})
            </h2>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLikeModalOpen(false)}>
              <X size={24} />
            </button>

            {isLoadingLikes ? (
              <p className="text-center text-zinc-400">Loading list...</p>
            ) : likedUsers.length === 0 ? (
              <p className="text-center text-zinc-400">No one has liked this post yet.</p>
            ) : (
              <ul className="space-y-3">
                {likedUsers.map((user, idx) => (
                  <li
                    key={idx}
                    onClick={() => navigate(`/home/user-info/${user._id}`)}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded cursor-pointer"
                  >
                    <img
                      src={user.avatar || "https://i.pravatar.cc/100"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-white">{user.firstname} {user.lastname}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </main>
  );
};

export default UserInfo_Follow;

