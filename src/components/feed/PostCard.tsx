import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const PostCard = ({ author, avatar, time, content, image, likes, comments, shares }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div className="bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-bold">
            {avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{author}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{content}</p>

      {/* Image */}
      {image && (
        <div className="w-full bg-muted aspect-video flex items-center justify-center text-muted-foreground text-sm">
          📷 {image}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-destructive-foreground" />
          </div>
          <span>{likeCount}</span>
        </div>
        <div className="flex gap-3">
          <span>{comments} comments</span>
          <span>{shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-border mx-4">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            liked ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${liked ? "fill-destructive" : ""}`} />
          Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
