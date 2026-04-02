import { Plus } from "lucide-react";

const stories = [
  { id: "you", name: "Your Story", avatar: "YO", isAdd: true },
  { id: "1", name: "Sarah", avatar: "SC", hasNew: true },
  { id: "2", name: "Alex", avatar: "AR", hasNew: true },
  { id: "3", name: "Jordan", avatar: "JL", hasNew: false },
  { id: "4", name: "Emma", avatar: "EW", hasNew: true },
  { id: "5", name: "Dev", avatar: "DS", hasNew: false },
];

const Stories = () => (
  <div className="bg-card border-b border-border">
    <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
      {stories.map((story) => (
        <button key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold relative ${
              story.isAdd
                ? "bg-secondary text-muted-foreground border-2 border-dashed border-muted-foreground/30"
                : story.hasNew
                ? "ring-2 ring-destructive ring-offset-2 ring-offset-card bg-gradient-to-br from-destructive to-destructive/70 text-destructive-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {story.isAdd ? <Plus className="w-5 h-5" /> : story.avatar}
          </div>
          <span className="text-[10px] text-muted-foreground truncate w-14 text-center">
            {story.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default Stories;
