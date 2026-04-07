import { UserPlus, Users, Check, X, Search, MessageCircle } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface UserResult {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  friendStatus: string | null; // null=none, pending, accepted
}

const FriendsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"requests" | "friends" | "search">("friends");
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<{ user_id: string; display_name: string | null; avatar_url: string | null }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    if (data) {
      const senderIds = data.map(r => r.sender_id);
      if (senderIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", senderIds);
        const pMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
        setRequests(data.map(r => ({ ...r, display_name: pMap[r.sender_id]?.display_name || "User", avatar_url: pMap[r.sender_id]?.avatar_url || null })));
      } else {
        setRequests([]);
      }
    }
  }, [user]);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friend_requests")
      .select("sender_id, receiver_id")
      .eq("status", "accepted")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (data && data.length > 0) {
      const friendIds = data.map(f => f.sender_id === user.id ? f.receiver_id : f.sender_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", friendIds);
      setFriends(profiles || []);
    } else {
      setFriends([]);
    }
  }, [user]);

  useEffect(() => { fetchRequests(); fetchFriends(); }, [fetchRequests, fetchFriends]);

  const handleAccept = async (requestId: string) => {
    await supabase.from("friend_requests").update({ status: "accepted" }).eq("id", requestId);
    toast({ title: "Friend request accepted!" });
    fetchRequests();
    fetchFriends();
  };

  const handleReject = async (requestId: string) => {
    await supabase.from("friend_requests").update({ status: "rejected" }).eq("id", requestId);
    fetchRequests();
  };

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) return;
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .ilike("display_name", `%${searchQuery}%`)
      .neq("user_id", user.id)
      .limit(20);

    if (data) {
      const userIds = data.map(p => p.user_id);
      const { data: existingReqs } = await supabase
        .from("friend_requests")
        .select("sender_id, receiver_id, status")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(userIds.map(id => `sender_id.eq.${id},receiver_id.eq.${id}`).join(","));

      const results: UserResult[] = data.map(p => {
        const req = (existingReqs || []).find(r =>
          (r.sender_id === user.id && r.receiver_id === p.user_id) ||
          (r.sender_id === p.user_id && r.receiver_id === user.id)
        );
        return { ...p, friendStatus: req?.status || null };
      });
      setSearchResults(results);
    }
  };

  const sendRequest = async (receiverId: string) => {
    if (!user) return;
    const { error } = await supabase.from("friend_requests").insert({ sender_id: user.id, receiver_id: receiverId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Friend request sent!" });
      handleSearch();
    }
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

      <div className="flex border-b border-border">
        {(["friends", "requests", "search"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? "text-destructive border-b-2 border-destructive" : "text-muted-foreground"}`}
          >
            {t} {t === "requests" && requests.length > 0 && `(${requests.length})`}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "search" && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30"
              />
            </div>
            <div className="space-y-3 mt-4">
              {searchResults.map(u => (
                <div key={u.user_id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold overflow-hidden">
                    {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : getInitials(u.display_name)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{u.display_name || "User"}</p>
                  </div>
                  {u.friendStatus === "accepted" ? (
                    <span className="text-xs text-muted-foreground px-3 py-1.5">Friends</span>
                  ) : u.friendStatus === "pending" ? (
                    <span className="text-xs text-muted-foreground px-3 py-1.5">Pending</span>
                  ) : (
                    <button onClick={() => sendRequest(u.user_id)} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold flex items-center gap-1">
                      <UserPlus className="w-3 h-3" /> Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-3">
            {requests.length === 0 && <p className="text-center text-muted-foreground py-8">No pending requests</p>}
            {requests.map(r => (
              <div key={r.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold overflow-hidden">
                  {r.avatar_url ? <img src={r.avatar_url} className="w-full h-full object-cover" /> : getInitials(r.display_name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{r.display_name}</p>
                  <p className="text-xs text-muted-foreground">Sent you a friend request</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(r.id)} className="p-2 rounded-lg bg-destructive text-destructive-foreground"><Check className="w-4 h-4" /></button>
                  <button onClick={() => handleReject(r.id)} className="p-2 rounded-lg bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "friends" && (
          <div className="space-y-3">
            {friends.length === 0 && <p className="text-center text-muted-foreground py-8">No friends yet. Search for users to connect!</p>}
            {friends.map(f => (
              <div key={f.user_id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold overflow-hidden">
                  {f.avatar_url ? <img src={f.avatar_url} className="w-full h-full object-cover" /> : getInitials(f.display_name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{f.display_name || "User"}</p>
                </div>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FriendsPage;
