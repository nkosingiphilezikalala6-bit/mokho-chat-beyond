import { useState, useEffect, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/hooks/useProfile";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatSidebar from "@/components/chat/ChatSidebar";

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  avatar_url?: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  media_url?: string | null;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    // Get all friends (accepted friend requests)
    const { data: friends } = await supabase
      .from("friend_requests")
      .select("sender_id, receiver_id")
      .eq("status", "accepted")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!friends || friends.length === 0) { setContacts([]); return; }

    const friendIds = friends.map(f => f.sender_id === user.id ? f.receiver_id : f.sender_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", friendIds);

    const contactList: Contact[] = (profiles || []).map(p => ({
      id: p.user_id,
      name: p.display_name || "User",
      avatar: getInitials(p.display_name),
      avatar_url: p.avatar_url,
      lastMessage: "",
      time: "",
      unread: 0,
      online: false,
    }));

    // Get latest messages for each contact
    for (const c of contactList) {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, sender_id, read")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${c.id}),and(sender_id.eq.${c.id},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastMsg) {
        c.lastMessage = lastMsg.content || "📎 Media";
        c.time = new Date(lastMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", c.id)
        .eq("receiver_id", user.id)
        .eq("read", false);
      c.unread = count || 0;
    }

    setContacts(contactList);
  }, [user]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const fetchMessages = useCallback(async (contactId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages((data || []).map(m => ({
      id: m.id,
      text: m.content || "",
      sent: m.sender_id === user.id,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      media_url: m.media_url,
    })));

    // Mark as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", contactId)
      .eq("receiver_id", user.id)
      .eq("read", false);
  }, [user]);

  useEffect(() => {
    if (selectedContact) fetchMessages(selectedContact.id);
  }, [selectedContact, fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as any;
        if (selectedContact && ((msg.sender_id === user.id && msg.receiver_id === selectedContact.id) || (msg.sender_id === selectedContact.id && msg.receiver_id === user.id))) {
          setMessages(prev => [...prev, {
            id: msg.id,
            text: msg.content || "",
            sent: msg.sender_id === user.id,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            media_url: msg.media_url,
          }]);
          if (msg.sender_id === selectedContact.id) {
            supabase.from("messages").update({ read: true }).eq("id", msg.id);
          }
        }
        fetchContacts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedContact, fetchContacts]);

  const handleSend = async (text: string) => {
    if (!user || !selectedContact) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: text,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex min-h-0">
        <div className={`${selectedContact ? "hidden md:block" : "w-full md:w-80"} md:w-80 border-r border-border flex-shrink-0`}>
          <ChatSidebar contacts={contacts} selectedId={selectedContact?.id || null} onSelect={setSelectedContact} />
        </div>
        <div className={`${selectedContact ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}>
          {selectedContact ? (
            <ChatWindow contact={selectedContact} messages={messages} onSend={handleSend} onBack={() => setSelectedContact(null)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-destructive-foreground" />
              </div>
              <p className="text-lg font-medium">
                {contacts.length === 0 ? "Add friends to start chatting!" : "Select a conversation to start chatting"}
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatPage;
