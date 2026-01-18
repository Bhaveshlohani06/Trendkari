import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../utils/timeago";

const ExploreCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition mb-5 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="font-semibold text-lg leading-snug mb-2 line-clamp-2">
          {post.title}
        </h2>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author?.name || "Trendkari"}</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ExploreCard;
