import { MessageCircle, Wifi } from "lucide-react";
import Stories from "@/components/feed/Stories";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import BottomNav from "@/components/layout/BottomNav";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PostWithProfile {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
}

const HomePage = () => {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from("posts")
      .select("id, user_id, content, media_url, media_type, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
      setPosts(data.map(p => ({
        ...p,
        display_name: profileMap[p.user_id]?.display_name || "User",
        avatar_url: profileMap[p.user_id]?.avatar_url || null,
      })));
    } else {
      setPosts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-destructive-foreground" />
          </div>
          <span className="text-xl font-bold text-destructive tracking-tight">MOKHO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
            <Wifi className="w-3 h-3" />
            35 MB Free
          </div>
        </div>
      </header>

      <Stories />
      <div className="mt-2">
        <CreatePost onPostCreated={fetchPosts} />
      </div>

      <div className="mt-2 space-y-2">
        {loading && <p className="text-center text-muted-foreground py-8">Loading posts...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No posts yet. Be the first to share!</p>
        )}
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            user_id={post.user_id}
            author={post.display_name || "User"}
            avatar_url={post.avatar_url}
            created_at={post.created_at}
            content={post.content}
            media_url={post.media_url}
            media_type={post.media_type}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
