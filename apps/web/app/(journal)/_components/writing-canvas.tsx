import { TiptapEditor } from "./tiptap-editor";
import { MoreHorizontal, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WritingCanvasProps {
  title: string;
  setTitle: (title: string) => void;
  body: string;
  setBody: (body: string) => void;
  onSave: () => void;
  wordCount: number;
  setWordCount: (count: number) => void;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

export function WritingCanvas({ 
  title, 
  setTitle, 
  body, 
  setBody, 
  onSave,
  wordCount,
  setWordCount,
  saveStatus
}: WritingCanvasProps) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="flex-1 flex flex-col bg-background relative">
      {/* Top Toolbar */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-transparent shrink-0">
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Menu size={20} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-medium tracking-widest uppercase">
          <span className="text-muted-foreground">{dateStr}</span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-muted-foreground">{wordCount} words</span>
          
          {saveStatus && saveStatus !== "idle" && (
            <>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span className={cn(
                "transition-all duration-500 flex items-center gap-1.5",
                saveStatus === "saving" ? "text-primary animate-pulse" : 
                saveStatus === "saved" ? "text-emerald-500" : "text-destructive"
              )}>
                {saveStatus === "saving" ? "Saving..." : 
                 saveStatus === "saved" ? "Saved" : "Save Error"}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={20} />
          </Button>
          <Button 
            onClick={onSave}
            className="bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 h-8 px-6 transition-all"
          >
            Done
          </Button>
        </div>
      </header>

      {/* Writing Canvas */}
      <div className="flex-1 overflow-y-auto w-full flex justify-center pb-32">
        <div className="w-full max-w-2xl px-6 sm:px-12 mt-12 sm:mt-24">
          
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl sm:text-4xl font-medium tracking-tight text-foreground placeholder:text-muted-foreground/30 outline-none bg-transparent mb-6 border-none focus:ring-0" 
            placeholder="Entry title..."
          />
          
          {/* Tiptap Rich Text Editor */}
          <TiptapEditor 
            content={body} 
            onChange={(json) => setBody(JSON.stringify(json))} 
            onWordCountChange={setWordCount}
          />
        </div>
      </div>
    </main>
  );
}
