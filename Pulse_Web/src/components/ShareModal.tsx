import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPost, fetchAllPosts, fetchUserPosts } from "../redux/slice/postProfileSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

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
      if (id) await dispatch(fetchUserPosts(id));

      toast.success("Share successfully!");
      onClose();
    } catch (err) {
      toast.error("Share failure: " + err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-2xl w-[90%] max-w-lg relative shadow-lg text-white">
        {/* Nút Quay về */}
        <button
          className="absolute top-4 left-4 text-white hover:text-green-400 transition cursor-pointer"
          onClick={onClose}
        >
          <ArrowLeft size={22} />
        </button>

        {/* Nút đóng (X) */}
        <button
          className="absolute top-4 right-4 text-white hover:text-red-400 transition cursor-pointer"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-center text-lg font-semibold mb-4">✨ Share the article</h2>

        <textarea
          className="w-full bg-zinc-900 p-4 rounded-xl text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="What do you think about this article?"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="bg-zinc-900 mt-4 p-4 rounded-xl border border-zinc-700 shadow-inner">
          <div className="flex items-center gap-3">
            <img
              src={sharedPost.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
            <span className="font-medium text-sm">{sharedPost.username}</span>
          </div>
          <p className="text-zinc-300 text-sm mt-2">{sharedPost.content}</p>
          {sharedPost.media?.[0] && (
            <img
              src={sharedPost.media[0]}
              alt="Shared media"
              className="w-full h-44 object-cover rounded-lg mt-3 border border-zinc-600"
            />
          )}
        </div>

        <button
          onClick={handleShare}
          disabled={!content.trim()}
          className={`mt-6 w-full py-3 rounded-full font-semibold transition shadow-md cursor-pointer ${
            content.trim()
              ? "bg-green-500 hover:bg-green-400 text-white"
              : "bg-zinc-600 text-white opacity-50 cursor-not-allowed"
          }`}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
