"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, List, Quote, Heading1, Heading2 } from "lucide-react";

import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu } from "@tiptap/react/menus";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";

interface TiptapEditorProps {
  content: string;
  onChange: (json: any) => void;
  onWordCountChange: (count: number) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  onWordCountChange,
  placeholder = "Write your heart out..."
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        }
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: parseInitialContent(content),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[50vh]",
      },
    },
    onUpdate: ({ editor }) => {
      // Serialize what the editor just produced so the parent's echo
      // (setBody → re-render → content prop) is recognized as "ours"
      // and the sync useEffect below will skip the redundant setContent.
      const json = editor.getJSON();
      const serialized = JSON.stringify(json);
      lastInjectedContent.current = serialized;

      onChange(json);
      onWordCountChange(editor.storage.characterCount.words());
    },
  });

  // Track the last content string we pushed into (or received from) the
  // editor so we can distinguish parent-driven updates from editor echoes.
  const lastInjectedContent = useRef<string>(content || "");

  useEffect(() => {
    if (!editor || !content) return;

    // Skip if this content is the same thing the editor just produced
    // (i.e. it's the parent echoing back what onUpdate sent).
    if (content === lastInjectedContent.current) return;

    // Genuinely new content from the parent (initial load, draft recovery, etc.)
    lastInjectedContent.current = content;
    editor.commands.setContent(parseInitialContent(content), { emitUpdate: false });
  }, [editor, content]);

  function parseInitialContent(raw: string) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      // If it's not JSON, it's legacy plain text.
      // Tiptap can handle plain text strings as HTML/text content.
      return raw;
    }
  }

  // Handle initial word count
  useEffect(() => {
    if (editor) {
      onWordCountChange(editor.storage.characterCount.words());
    }
  }, [editor, onWordCountChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 p-1 bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-xl z-50 overflow-hidden"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("bold") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("italic") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("heading", { level: 1 }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("heading", { level: 2 }) ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Heading2 size={16} />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("bulletList") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-muted transition-colors ${editor.isActive("blockquote") ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Quote size={16} />
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
