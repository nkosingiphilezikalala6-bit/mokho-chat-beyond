import { useState } from "react";
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Menu } from "lucide-react";
import type { Contact, Message } from "@/pages/ChatPage";

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSend: (text: string) => void;
  onToggleSidebar: () => void;
}

const ChatWindow = ({ contact, messages, onSend, onToggleSidebar }: ChatWindowProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-secondary transition-colors md:hidden">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-secondary transition-colors hidden md:block">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full mokho-gradient flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {contact.avatar}
            </div>
            {contact.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-mokho-online border-2 border-card" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">
              {contact.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Video className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sent ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 ${
                msg.sent ? "chat-bubble-sent" : "chat-bubble-received"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {contact.online && (
          <div className="flex justify-start">
            <div className="chat-bubble-received px-4 py-3 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl mokho-gradient text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity mokho-glow"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
