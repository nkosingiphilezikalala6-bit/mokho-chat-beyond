import { UserPlus, Users } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { MessageCircle } from "lucide-react";

const suggestions = [
  { name: "Mike Johnson", avatar: "MJ", mutualFriends: 12 },
  { name: "Lisa Park", avatar: "LP", mutualFriends: 8 },
  { name: "David Kim", avatar: "DK", mutualFriends: 5 },
  { name: "Nina Patel", avatar: "NP", mutualFriends: 3 },
  { name: "Chris Evans", avatar: "CE", mutualFriends: 15 },
];

const FriendsPage = () => (
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
      <h2 className="text-lg font-bold text-foreground mb-1">Friend Suggestions</h2>
      <p className="text-sm text-muted-foreground mb-4">People you may know</p>

      <div className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.name} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
            <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold">
              {s.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" /> {s.mutualFriends} mutual friends
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Add
            </button>
          </div>
        ))}
      </div>
    </div>

    <BottomNav />
  </div>
);

export default FriendsPage;
