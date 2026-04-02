import { Heart, MessageCircle, UserPlus, Share2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";

const notifications = [
  { icon: Heart, color: "text-destructive", text: "Sarah Chen liked your post", time: "2m ago", unread: true },
  { icon: MessageCircle, color: "text-destructive", text: "Alex Rivera commented on your photo", time: "15m ago", unread: true },
  { icon: UserPlus, color: "text-destructive", text: "Jordan Lee sent you a friend request", time: "1h ago", unread: true },
  { icon: Share2, color: "text-muted-foreground", text: "Emma Wilson shared your post", time: "3h ago", unread: false },
  { icon: Heart, color: "text-muted-foreground", text: "12 people liked your status update", time: "5h ago", unread: false },
  { icon: MessageCircle, color: "text-muted-foreground", text: "Design Team mentioned you in a comment", time: "1d ago", unread: false },
];

const NotificationsPage = () => (
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
      <div className="space-y-1">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              n.unread ? "bg-destructive/5" : "hover:bg-secondary"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.unread ? "bg-destructive/10" : "bg-secondary"}`}>
              <n.icon className={`w-5 h-5 ${n.color}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${n.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{n.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
            </div>
            {n.unread && <div className="w-2.5 h-2.5 rounded-full bg-destructive" />}
          </div>
        ))}
      </div>
    </div>

    <BottomNav />
  </div>
);

export default NotificationsPage;
