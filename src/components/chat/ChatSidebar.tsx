import { Search, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { Contact } from "@/pages/ChatPage";

interface ChatSidebarProps {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (contact: Contact) => void;
}

const ChatSidebar = ({ contacts, selectedId, onSelect }: ChatSidebarProps) => {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg mokho-gradient flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MOKHO</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/80 transition-colors ${
              selectedId === contact.id ? "bg-primary/10 border-r-2 border-primary" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full mokho-gradient flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {contact.avatar}
              </div>
              {contact.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mokho-online border-2 border-card" />
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground truncate">{contact.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{contact.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground truncate">{contact.lastMessage}</span>
                {contact.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full mokho-gradient flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
