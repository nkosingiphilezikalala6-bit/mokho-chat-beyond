import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { MessageCircle } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";

export interface Contact {
  id: string;
  name: string;
  avatar: string;
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
}

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", lastMessage: "That sounds great! 🎉", time: "2m", unread: 3, online: true },
  { id: "2", name: "Alex Rivera", avatar: "AR", lastMessage: "Check out this link...", time: "15m", unread: 0, online: true },
  { id: "3", name: "Design Team", avatar: "DT", lastMessage: "New mockups ready", time: "1h", unread: 1, online: false },
  { id: "4", name: "Jordan Lee", avatar: "JL", lastMessage: "See you tomorrow!", time: "3h", unread: 0, online: false },
  { id: "5", name: "Emma Wilson", avatar: "EW", lastMessage: "Thanks for your help 😊", time: "1d", unread: 0, online: true },
  { id: "6", name: "Dev Squad", avatar: "DS", lastMessage: "PR merged ✅", time: "1d", unread: 5, online: false },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hey! How's the project going?", sent: false, time: "10:30 AM" },
    { id: "m2", text: "Going great! Almost done with the UI", sent: true, time: "10:32 AM" },
    { id: "m3", text: "Can you show me a preview?", sent: false, time: "10:33 AM" },
    { id: "m4", text: "Sure! Let me share my screen in a bit 🖥️", sent: true, time: "10:34 AM" },
    { id: "m5", text: "That sounds great! 🎉", sent: false, time: "10:35 AM" },
  ],
  "2": [
    { id: "m1", text: "Have you seen the new framework?", sent: false, time: "9:00 AM" },
    { id: "m2", text: "Not yet, send the link!", sent: true, time: "9:05 AM" },
    { id: "m3", text: "Check out this link...", sent: false, time: "9:06 AM" },
  ],
  "3": [
    { id: "m1", text: "New mockups ready", sent: false, time: "8:00 AM" },
  ],
};

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (text: string) => {
    if (!selectedContact) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex min-h-0">
        {/* Mobile: show sidebar when no contact selected, show chat when contact selected */}
        {/* Desktop: always show sidebar + chat side by side */}
        
        {/* Sidebar */}
        <div className={`${selectedContact ? 'hidden md:block' : 'w-full md:w-80'} md:w-80 border-r border-border flex-shrink-0`}>
          <ChatSidebar
            contacts={mockContacts}
            selectedId={selectedContact?.id || null}
            onSelect={(c) => setSelectedContact(c)}
          />
        </div>

        {/* Chat Area */}
        <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
          {selectedContact ? (
            <ChatWindow
              contact={selectedContact}
              messages={messages[selectedContact.id] || []}
              onSend={handleSend}
              onBack={() => setSelectedContact(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-destructive-foreground" />
              </div>
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatPage;
