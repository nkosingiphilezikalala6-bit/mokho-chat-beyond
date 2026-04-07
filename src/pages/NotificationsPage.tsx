import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "like" | "comment" | "friend_request";
  text: string;
  time: string;
  icon: typeof Heart;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const items: Notification[] = [];

      // Likes on my posts
      const { data: myPosts } = await supabase.from("posts").select("id").eq("user_id", user.id);
      if (myPosts && myPosts.length > 0) {
        const postIds = myPosts.map(p => p.id);
        const { data: likes } = await supabase
          .from("likes")
          .select("id, user_id, created_at, post_id")
          .in("post_id", postIds)
          .neq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (likes) {
          const userIds = [...new Set(likes.map(l => l.user_id))];
          const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
          const pMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.display_name]));
          likes.forEach(l => {
            items.push({
              id: `like-${l.id}`,
              type: "like",
              text: `${pMap[l.user_id] || "Someone"} liked your post`,
              time: formatDistanceToNow(new Date(l.created_at), { addSuffix: true }),
              icon: Heart,
            });
          });
        }

        // Comments on my posts
        const { data: comments } = await supabase
          .from("comments")
          .select("id, user_id, created_at")
          .in("post_id", postIds)
          .neq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (comments) {
          const userIds = [...new Set(comments.map(c => c.user_id))];
          const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
          const pMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.display_name]));
          comments.forEach(c => {
            items.push({
              id: `comment-${c.id}`,
              type: "comment",
              text: `${pMap[c.user_id] || "Someone"} commented on your post`,
              time: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
              icon: MessageCircle,
            });
          });
        }
      }

      // Friend requests
      const { data: requests } = await supabase
        .from("friend_requests")
        .select("id, sender_id, created_at")
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (requests) {
        const userIds = requests.map(r => r.sender_id);
        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
          const pMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.display_name]));
          requests.forEach(r => {
            items.push({
              id: `fr-${r.id}`,
              type: "friend_request",
              text: `${pMap[r.sender_id] || "Someone"} sent you a friend request`,
              time: formatDistanceToNow(new Date(r.created_at), { addSuffix: true }),
              icon: UserPlus,
            });
          });
        }
      }

      items.sort((a, b) => a.time.localeCompare(b.time));
      setNotifications(items);
    };
    fetch();
  }, [user]);

  const getIconColor = (type: string) => {
    if (type === "like") return "text-destructive";
    if (type === "friend_request") return "text-destructive";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-destructive-foreground" />
          </div>
          <span className="text-xl font-bold text-destructive">MOKHO</span>
        </div>
      </header>

      <div className="p-4">
        <h2 className="text-lg font-bold text-foreground mb-4">Notifications</h2>
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        )}
        <div className="space-y-1">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10">
                <n.icon className={`w-5 h-5 ${getIconColor(n.type)}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
