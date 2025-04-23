"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import type { ReactQuillProps, ReactQuill } from "react-quill";

// Define type for the forwarded ref component
interface ReactQuillWithRefProps extends ReactQuillProps {
  forwardedRef: React.Ref<ReactQuill>;
}

// Dynamic import for ReactQuill to avoid SSR issues
const DynamicReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function ReactQuillWithRef({ forwardedRef, ...props }: ReactQuillWithRefProps) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border rounded-md p-4 min-h-[200px] bg-muted/20">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <DynamicReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write something..."}
        className="bg-background"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgba(115, 115, 115, 0.6);
        }
      `}</style>
    </div>
  );
}