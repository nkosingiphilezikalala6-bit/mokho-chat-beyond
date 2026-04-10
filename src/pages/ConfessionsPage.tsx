import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, Flame, Laugh, Frown, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const COLORS = [
  { name: "purple", bg: "bg-purple-600", text: "text-white" },
  { name: "blue", bg: "bg-blue-600", text: "text-white" },
  { name: "pink", bg: "bg-pink-500", text: "text-white" },
  { name: "emerald", bg: "bg-emerald-600", text: "text-white" },
  { name: "amber", bg: "bg-amber-500", text: "text-black" },
  { name: "rose", bg: "bg-rose-500", text: "text-white" },
];

const REACTIONS = [
  { emoji: "❤️", icon: Heart, key: "heart" },
  { emoji: "🔥", icon: Flame, key: "fire" },
  { emoji: "😂", icon: Laugh, key: "laugh" },
  { emoji: "😢", icon: Frown, key: "sad" },
];

type Confession = {
  id: string;
  content: string;
  color: string;
  created_at: string;
  reactions: Record<string, number>;
  user_id: string;
};

const ConfessionsPage = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("purple");
  const [loading, setLoading] = useState(false);

  const fetchConfessions = async () => {
    const { data } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setConfessions(data as unknown as Confession[]);
  };

  useEffect(() => {
    fetchConfessions();

    const channel = supabase
      .channel("confessions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => {
        fetchConfessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handlePost = async () => {
    if (!content.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("confessions").insert({
      content: content.trim(),
      color: selectedColor,
      user_id: user.id,
    });
    if (error) {
      toast.error("Failed to post confession");
    } else {
      setContent("");
      setShowCreate(false);
      toast.success("Posted anonymously! 🤫");
    }
    setLoading(false);
  };

  const handleReact = async (confession: Confession, reactionKey: string) => {
    const currentReactions = (confession.reactions || {}) as Record<string, number>;
    const updated = { ...currentReactions, [reactionKey]: (currentReactions[reactionKey] || 0) + 1 };
    await supabase.from("confessions").update({ reactions: updated }).eq("id", confession.id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("confessions").delete().eq("id", id);
    toast.success("Confession deleted");
  };

  const getColorClasses = (color: string) => {
    return COLORS.find((c) => c.name === color) || COLORS[0];
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Confessions 🤫</h1>
            <p className="text-xs text-muted-foreground">Share anonymously. No one knows it's you.</p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowCreate(!showCreate)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          >
            {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Create Confession */}
      {showCreate && (
        <div className="mx-4 mt-4 p-4 bg-card rounded-2xl border border-border shadow-lg animate-in slide-in-from-top-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? This is completely anonymous..."
            className="min-h-[100px] resize-none border-0 bg-muted/50 rounded-xl text-sm"
            maxLength={500}
          />
          <div className="flex items-center gap-2 mt-3">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-7 h-7 rounded-full ${c.bg} transition-all ${
                  selectedColor === c.name ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-muted-foreground">{content.length}/500</span>
            <Button
              size="sm"
              onClick={handlePost}
              disabled={!content.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Confess
            </Button>
          </div>
        </div>
      )}

      {/* Confessions Feed */}
      <div className="px-4 mt-4 space-y-4">
        {confessions.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-2">🤫</p>
            <p className="font-medium">No confessions yet</p>
            <p className="text-sm">Be the first to share anonymously</p>
          </div>
        )}

        {confessions.map((confession) => {
          const colorClasses = getColorClasses(confession.color);
          const reactions = (confession.reactions || {}) as Record<string, number>;
          const isOwn = confession.user_id === user?.id;

          return (
            <div
              key={confession.id}
              className={`${colorClasses.bg} ${colorClasses.text} rounded-2xl p-5 shadow-lg relative`}
            >
              {isOwn && (
                <button
                  onClick={() => handleDelete(confession.id)}
                  className="absolute top-3 right-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                {confession.content}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs opacity-70">
                  {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
                </span>

                <div className="flex items-center gap-1">
                  {REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => handleReact(confession, r.key)}
                      className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-xs"
                    >
                      <span>{r.emoji}</span>
                      {reactions[r.key] ? (
                        <span className="font-bold">{reactions[r.key]}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default ConfessionsPage;
