import { User, Settings, Shield, Moon, Wifi, LogOut, MessageCircle, Mic, EyeOff, Music } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: User, label: "My Profile", desc: "View your profile" },
  { icon: Wifi, label: "Free Mode (35 MB)", desc: "Daily free data for chat & status", highlight: true },
  { icon: Mic, label: "Voice Rooms", desc: "Join live audio conversations", isNew: true },
  { icon: EyeOff, label: "Anonymous Posts", desc: "Post without showing identity", isNew: true },
  { icon: Music, label: "MOKHO Music", desc: "Listen & share music", isNew: true },
  { icon: Shield, label: "Privacy & Security", desc: "Encryption settings" },
  { icon: Moon, label: "Dark Mode", desc: "Switch appearance" },
  { icon: Settings, label: "Settings", desc: "App preferences" },
  { icon: LogOut, label: "Log Out", desc: "Sign out of MOKHO" },
];

const MenuPage = () => {
  const navigate = useNavigate();

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

      {/* User card */}
      <div className="p-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-lg font-bold">
            YO
          </div>
          <div>
            <p className="font-bold text-foreground">Your Name</p>
            <p className="text-sm text-muted-foreground">View your profile</p>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary ${
                item.highlight ? "bg-destructive/5" : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                item.highlight ? "bg-destructive" : "bg-secondary"
              }`}>
                <item.icon className={`w-4.5 h-4.5 ${item.highlight ? "text-destructive-foreground" : "text-foreground"}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  {item.label}
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-destructive text-destructive-foreground">NEW</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MenuPage;
