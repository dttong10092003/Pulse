import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  setAllNotifications,
  markAllAsReadRedux,
  markOneAsReadRedux,
} from '../../redux/slice/notificationSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { getUserDetails } from '../../redux/slice/userSlice';
import { FaRegCommentDots, FaHeart, FaUserPlus, FaRegEnvelope } from 'react-icons/fa';

import { useNavigate } from "react-router-dom";
const tabs = ['all', 'message', 'like', 'comment', 'follow'] as const;

const Notification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const userDetail = useSelector((state: RootState) => state.auth.user);
  const userDetailId = userDetail?._id || '';

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'message' | 'like' | 'comment' | 'follow'>('all');
  const [error, setError] = useState<string | null>(null);
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const [postMap, setPostMap] = useState<Record<string, any>>({}); // ✅

  const getNotiStyle = (type: string, isRead: boolean) => {
    if (isRead) return 'border-zinc-200 bg-gray text-white-800';
    switch (type) {
      case 'message': return 'border-blue-500 bg-blue-900/30 text-white';
      case 'like': return 'border-red-500 bg-red-900/30 text-white';
      case 'comment': return 'border-purple-500 bg-purple-900/30 text-white';
      case 'follow': return 'border-green-500 bg-green-900/30 text-white';
      default: return 'border-gray-700 bg-gray-800 text-white';
    }
  };

  const getNotiIcon = (type: string) => {
    switch (type) {
      case 'message': return <FaRegEnvelope className="text-blue-400 text-3xl" />;
      case 'like': return <FaHeart className="text-red-400 text-3xl" />;
      case 'comment': return <FaRegCommentDots className="text-purple-400 text-3xl" />;
      case 'follow': return <FaUserPlus className="text-green-400 text-3xl" />;
      default: return null;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (userDetail?._id) {
          const res = await api.get(`/noti/get-all?userId=${userDetail._id}`);
          dispatch(setAllNotifications(res.data));
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userDetail, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      const senderIds = [...new Set(notifications.map(n => n.senderId))];
      for (const id of senderIds) {
        if (!userMap[id]) {
          try {
            const user = await dispatch(getUserDetails(id)).unwrap();
            setUserMap(prev => ({ ...prev, [id]: user }));
          } catch (err) {
            console.error("❌ Lỗi fetch user:", err);
          }
        }
      }
    };
    if (notifications.length > 0) fetchUsers();
  }, [notifications]);

  // ✅ Fetch bài viết theo postId (chỉ nếu type là 'like')
  useEffect(() => {
    const fetchPosts = async () => {
      const postIds = notifications
        .filter(n => n.type === 'like' && n.postId)
        .map(n => n.postId!);

      const uniquePostIds = [...new Set(postIds)];

      for (const id of uniquePostIds) {
        if (!postMap[id]) {
          try {
            const res = await api.get(`/posts/${id}`);
            setPostMap(prev => ({ ...prev, [id]: res.data }));
          } catch (error) {
            console.error('❌ Error fetching post:', error);
          }
        }
      }
    };

    if (notifications.length > 0) fetchPosts();
  }, [notifications]);

  const handleReadAll = async () => {
    const ids = notifications.map(n => n._id);
    await api.patch('/noti/read-all', { ids, userId: userDetailId });
    dispatch(markAllAsReadRedux());
  };

  // const handleReadOne = async (id: string) => {
  //   await api.patch(`/noti/read-one/${id}`, { userId: userDetailId });
  //   dispatch(markOneAsReadRedux(id));
    
  // };

  const handleReadOne = async (noti: typeof notifications[number]) => {
    try {
      await api.patch(`/noti/read-one/${noti._id}`, { userId: userDetailId });
      dispatch(markOneAsReadRedux(noti._id));
  
      // Điều hướng tùy loại thông báo
      if (noti.type === 'like' || noti.type === 'follow') {
        navigate(`/home/user-info/${noti.senderId}`);
      } else if (noti.type === 'comment' && noti.postId) {
        navigate(`/home/posts/${noti.postId}`);
      }
      // message thì không navigate
    } catch (err) {
      console.error("❌ handleReadOne error:", err);
    }
  };

  
  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  return (
    <div className="w-full h-screen bg-zinc-900 text-white p-6 text-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button onClick={handleReadAll} className="text-base text-white px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md">
          Read all
        </button>
      </div>

      <div className="flex space-x-4 bg-zinc-800 p-3 rounded-md mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-md text-base capitalize ${activeTab === tab ? 'bg-white text-black font-semibold' : 'text-white hover:text-gray-300'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-10 animate-pulse">Đang tải thông báo...</div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10">Error: {error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 mt-10 italic">Không có thông báo.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(noti => {
            const sender = userMap[noti.senderId];
            return (
              <div
                key={noti._id}
                className={`px-6 py-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${getNotiStyle(noti.type, noti.isRead)}`}
                onClick={() => handleReadOne(noti)}
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  <span>{getNotiIcon(noti.type)}</span>
                  <img
                    src={sender?.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold truncate">
                      {sender ? `${sender.firstname} ${sender.lastname}` : "Đang tải..."}
                    </span>
                    <span className="truncate">
                      {noti.type === 'like' ? (
                        
                        <>
                          đã thích bài viết{' '}
                          <span className="font-semibold text-blue-400">
                            {postMap[noti.postId!]?.content || '...'}
                          </span>{' '}
                          của bạn
                        </>
                      ) : noti.type === 'follow' ? (
                       
                        <>đã bắt đầu theo dõi bạn</>
                      ) : noti.type === 'message' ? (
                        <>
                          đã gửi tin nhắn: "
                          <span className="italic text-zinc-300">
                            {noti.messageContent || '...'}
                          </span>
                          "
                        </>
                      ) : noti.type === 'comment' ? (
                        <>
                          đã bình luận: "
                          <span className="italic text-purple-300">
                            {noti.commentContent || '...'}
                          </span>
                          "
                        </>
                      ) : (
                        <>thông báo không xác định</>
                      )}
                    </span>
                  </div>
                </div>
                <div className={`text-sm italic shrink-0 ml-4 ${noti.isRead ? 'text-zinc-400' : 'text-white font-semibold'}`}>
                  {noti.isRead ? 'Đã đọc' : 'Chưa đọc'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;
