interface Post {
  image?: string;
  title: string;
  user: string;
  avatar: string;
  category: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const hasImage = !!post.image;

  return (
    <div className="bg-zinc-900 p-3 rounded-lg flex flex-col justify-between min-h-[200px]">
      {hasImage ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      ) : (
        <div className="flex items-center justify-center text-white text-center h-48 bg-zinc-800 rounded-lg mb-2 px-2">
          <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
        </div>
      )}

      {/* Nếu có ảnh thì hiển thị tiêu đề bên dưới ảnh */}
      {hasImage && (
        <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
      )}

      <div className="flex items-center justify-between mt-2 text-zinc-400 text-sm">
        <div className="flex items-center gap-2">
          <img src={post.avatar} alt={post.user} className="w-6 h-6 rounded-full" />
          <span>{post.user}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span>{post.category}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
