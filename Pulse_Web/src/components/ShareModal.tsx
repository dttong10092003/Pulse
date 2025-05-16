import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPost, fetchAllPosts } from "../redux/slice/postProfileSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fetchUserPosts } from "../redux/slice/postProfileSlice";
interface ShareModalProps {
  onClose: () => void;
  sharedPost: {
    _id: string;
    content: string;
    media?: string[];
    username: string;
    avatar: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, sharedPost }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  // const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { id } = useParams();
  const handleShare = async () => {
    try {
      await dispatch(
        createPost({
          content,
          sharedPostId: sharedPost._id,
          tags: ["Share"],
        })
      ).unwrap();
      await dispatch(fetchAllPosts());
      if (id) {
        await dispatch(fetchUserPosts(id)); //cập nhật lại bài viết của user đang được xem
      }


      toast.success("Share successfully!");
      onClose();
    } catch (err) {
      toast.error("Share failure: " + err);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-2xl w-[90%] max-w-lg shadow-xl relative">
        <button
          className="absolute top-4 right-4 text-white hover:text-red-400 transition cursor-pointer"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-white font-bold text-lg text-center mb-6">✨ Share the article</h2>

        <textarea
          className="w-full bg-zinc-800 p-4 rounded-lg text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="What do you think about this article?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="bg-zinc-800 mt-5 p-4 rounded-xl border border-zinc-700 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={sharedPost.avatar}
              className="w-10 h-10 rounded-full object-cover border border-white"
              alt="avatar"
            />
            <span className="text-white font-medium text-sm">{sharedPost.username}</span>
          </div>
          <p className="text-zinc-300 text-sm mt-3">{sharedPost.content}</p>
          {sharedPost.media?.[0] && (
            <img
              src={sharedPost.media[0]}
              className="w-full h-44 object-cover rounded-lg mt-3 border border-zinc-600"
              alt="Shared media"
            />
          )}
        </div>

        <button
          onClick={handleShare}
          className="mt-6 w-full py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
