import { Image, Video, Smile } from "lucide-react";

const CreatePost = () => (
  <div className="bg-card border-b border-border p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-bold">
        YO
      </div>
      <div className="flex-1 px-4 py-2.5 rounded-full bg-secondary text-sm text-muted-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
        What's on your mind?
      </div>
    </div>
    <div className="flex items-center justify-around mt-3 pt-3 border-t border-border">
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
        <Video className="w-4 h-4 text-destructive" />
        <span>Live</span>
      </button>
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
        <Image className="w-4 h-4 text-green-500" />
        <span>Photo</span>
      </button>
      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
        <Smile className="w-4 h-4 text-yellow-500" />
        <span>Feeling</span>
      </button>
    </div>
  </div>
);

export default CreatePost;
