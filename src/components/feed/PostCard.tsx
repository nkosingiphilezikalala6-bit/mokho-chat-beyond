import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  id: string;
  user_id: string;
  author: string;
  avatar_url?: string | null;
  created_at: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
}

const PostCard = ({ id, user_id, author, avatar_url, created_at, content, media_url, media_type }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<{ id: string; content: string; user_id: string; display_name: string | null; created_at: string }[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", id);
      setLikeCount(count || 0);
      if (user) {
        const { data } = await supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).maybeSingle();
        setLiked(!!data);
      }
    };
    const fetchCommentCount = async () => {
      const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", id);
      setCommentCount(count || 0);
    };
    fetchLikes();
    fetchCommentCount();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", id).eq("user_id", user.id);
      setLiked(false);
      setLikeCount(c => c - 1);
    } else {
      await supabase.from("likes").insert({ post_id: id, user_id: user.id });
      setLiked(true);
      setLikeCount(c => c + 1);
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, content, user_id, created_at")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    if (data) {
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.display_name]));
      setComments(data.map(c => ({ ...c, display_name: profileMap[c.user_id] || "User" })));
    }
  };

  const toggleComments = async () => {
    if (!showComments) await loadComments();
    setShowComments(!showComments);
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;
    await supabase.from("comments").insert({ post_id: id, user_id: user.id, content: commentText.trim() });
    setCommentText("");
    setCommentCount(c => c + 1);
    await loadComments();
  };

  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-bold overflow-hidden">
            {avatar_url ? <img src={avatar_url} className="w-full h-full object-cover" /> : getInitials(author)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{author}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {content && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{content}</p>}

      {media_url && media_type === "video" && (
        <video src={media_url} className="w-full max-h-96 object-cover" controls />
      )}
      {media_url && media_type === "image" && (
        <img src={media_url} className="w-full max-h-96 object-cover" alt="Post media" />
      )}

      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-destructive-foreground" />
          </div>
          <span>{likeCount}</span>
        </div>
        <button onClick={toggleComments} className="hover:underline">{commentCount} comments</button>
      </div>

      <div className="flex items-center border-t border-border mx-4">
        <button onClick={handleLike} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${liked ? "text-destructive" : "text-muted-foreground"}`}>
          <ThumbsUp className={`w-4 h-4 ${liked ? "fill-destructive" : ""}`} />
          Like
        </button>
        <button onClick={toggleComments} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {showComments && (
        <div className="px-4 pb-3 border-t border-border animate-fade-in">
          <div className="max-h-48 overflow-y-auto space-y-2 py-2">
            {comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0">
                  {getInitials(c.display_name)}
                </div>
                <div className="bg-secondary rounded-xl px-3 py-1.5 flex-1">
                  <p className="text-xs font-semibold text-foreground">{c.display_name}</p>
                  <p className="text-xs text-foreground">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleComment()}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30"
            />
            <button onClick={handleComment} disabled={!commentText.trim()} className="p-2 rounded-xl bg-destructive text-destructive-foreground disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
