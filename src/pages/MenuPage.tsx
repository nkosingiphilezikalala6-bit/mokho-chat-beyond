import { User, Settings, Shield, Moon, Sun, Wifi, LogOut, MessageCircle, Camera, Loader2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, getInitials } from "@/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MenuPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      await supabase.storage.from("media").upload(path, file, { upsert: true });
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("user_id", user.id);
      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : prev);
      toast({ title: "Avatar updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ display_name: displayName, bio }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile(prev => prev ? { ...prev, display_name: displayName, bio } : prev);
      setEditingProfile(false);
      toast({ title: "Profile updated!" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
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

      <div className="p-4">
        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-lg font-bold overflow-hidden">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : getInitials(profile?.display_name)}
              </div>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                <Camera className="w-3 h-3 text-destructive-foreground" />
              </button>
            </div>
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-2">
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" className="w-full px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-destructive/30" />
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" className="w-full px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-destructive/30" rows={2} />
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="px-3 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold">Save</button>
                    <button onClick={() => setEditingProfile(false)} className="px-3 py-1 rounded-lg bg-secondary text-muted-foreground text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setEditingProfile(true)} className="cursor-pointer">
                  <p className="font-bold text-foreground">{profile?.display_name || "Your Name"}</p>
                  <p className="text-sm text-muted-foreground">{profile?.bio || "Tap to edit profile"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <button onClick={toggleDark} className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              {darkMode ? <Sun className="w-4.5 h-4.5 text-foreground" /> : <Moon className="w-4.5 h-4.5 text-foreground" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{darkMode ? "Light Mode" : "Dark Mode"}</p>
              <p className="text-xs text-muted-foreground">Switch appearance</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary bg-destructive/5">
            <div className="w-9 h-9 rounded-lg bg-destructive flex items-center justify-center">
              <Wifi className="w-4.5 h-4.5 text-destructive-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Free Mode (35 MB)</p>
              <p className="text-xs text-muted-foreground">Daily free data for chat & status</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Privacy & Security</p>
              <p className="text-xs text-muted-foreground">Encryption settings</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Settings className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Settings</p>
              <p className="text-xs text-muted-foreground">App preferences</p>
            </div>
          </button>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <LogOut className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Log Out</p>
              <p className="text-xs text-muted-foreground">Sign out of MOKHO</p>
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MenuPage;
