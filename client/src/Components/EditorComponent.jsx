import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";

const Editor = ({ onChange, initialData = null }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    editorRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "यहाँ समाचार लिखें...",
      data: initialData, // ✅ for edit post

      async onChange() {
        const savedData = await editorRef.current.save();
        onChange(savedData); // 🔥 ALWAYS object
      },
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [initialData, onChange]);

  return (
    <div
      id="editorjs"
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "6px",
      }}
    />
  );
};

export default Editor;


