import { MessageCircle, Wifi } from "lucide-react";
import Stories from "@/components/feed/Stories";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import BottomNav from "@/components/layout/BottomNav";

const mockPosts = [
  {
    author: "Sarah Chen",
    avatar: "SC",
    time: "2 hours ago",
    content: "Just finished building my new app with MOKHO! The free mode feature is amazing 🔥",
    likes: 42,
    comments: 8,
    shares: 3,
  },
  {
    author: "Alex Rivera",
    avatar: "AR",
    time: "4 hours ago",
    content: "Anyone else loving the voice rooms on MOKHO? Way better than any other platform! 🎙️",
    image: "Voice Room Screenshot",
    likes: 128,
    comments: 24,
    shares: 15,
  },
  {
    author: "Emma Wilson",
    avatar: "EW",
    time: "6 hours ago",
    content: "MOKHO's 35MB free mode saved me today! Was able to check messages and watch statuses without any data plan 📱✨",
    likes: 89,
    comments: 12,
    shares: 7,
  },
  {
    author: "Jordan Lee",
    avatar: "JL",
    time: "8 hours ago",
    content: "The anonymous posting feature is such a game changer. Finally a platform that understands privacy! 🔒",
    likes: 215,
    comments: 45,
    shares: 22,
  },
];

const HomePage = () => (
  <div className="min-h-screen bg-background pb-16">
    {/* Top Bar */}
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

    {/* Stories */}
    <Stories />

    {/* Create Post */}
    <div className="mt-2">
      <CreatePost />
    </div>

    {/* Feed */}
    <div className="mt-2 space-y-2">
      {mockPosts.map((post, i) => (
        <PostCard key={i} {...post} />
      ))}
    </div>

    <BottomNav />
  </div>
);

export default HomePage;
