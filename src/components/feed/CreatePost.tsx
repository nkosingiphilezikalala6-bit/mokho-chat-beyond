import { useState, useRef } from "react";
import { Image, Video, Smile, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, getInitials } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [posting, setPosting] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: "image" | "video") => {
    if (fileRef.current) {
      fileRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video");
    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");
    setMediaPreview(URL.createObjectURL(file));
    setShowInput(true);
  };

  const handlePost = async () => {
    if (!user || (!content.trim() && !mediaFile)) return;
    setPosting(true);
    try {
      let media_url: string | null = null;
      if (mediaFile) {
        const ext = mediaFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("media").upload(path, mediaFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        media_url = urlData.publicUrl;
      }
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim() || null,
        media_url,
        media_type: mediaType,
      });
      if (error) throw error;
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
      setShowInput(false);
      onPostCreated?.();
      toast({ title: "Post shared!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-bold">
          {getInitials(profile?.display_name)}
        </div>
        <button
          onClick={() => setShowInput(true)}
          className="flex-1 px-4 py-2.5 rounded-full bg-secondary text-sm text-muted-foreground text-left hover:bg-secondary/80 transition-colors"
        >
          What's on your mind?
        </button>
      </div>

      {showInput && (
        <div className="mt-3 animate-fade-in">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-destructive/30 min-h-[80px]"
            autoFocus
          />
          {mediaPreview && (
            <div className="relative mt-2">
              {mediaType === "video" ? (
                <video src={mediaPreview} className="w-full rounded-xl max-h-60 object-cover" controls />
              ) : (
                <img src={mediaPreview} className="w-full rounded-xl max-h-60 object-cover" alt="Preview" />
              )}
              <button
                onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              <button onClick={() => handleFileSelect("image")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Image className="w-5 h-5 text-green-500" />
              </button>
              <button onClick={() => handleFileSelect("video")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Video className="w-5 h-5 text-destructive" />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowInput(false); setContent(""); setMediaFile(null); setMediaPreview(null); }} className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary">
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || (!content.trim() && !mediaFile)}
                className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold disabled:opacity-40"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showInput && (
        <div className="flex items-center justify-around mt-3 pt-3 border-t border-border">
          <button onClick={() => { setShowInput(true); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
            <Video className="w-4 h-4 text-destructive" />
            <span>Live</span>
          </button>
          <button onClick={() => handleFileSelect("image")} className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
            <Image className="w-4 h-4 text-green-500" />
            <span>Photo</span>
          </button>
          <button onClick={() => setShowInput(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
            <Smile className="w-4 h-4 text-yellow-500" />
            <span>Feeling</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
