import { Home, MessageCircle, Bell, Menu, Users, Eye } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: Eye, label: "Confess", path: "/confessions" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Menu, label: "Menu", path: "/menu" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {active && <div className="absolute top-0 w-10 h-0.5 bg-destructive rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
