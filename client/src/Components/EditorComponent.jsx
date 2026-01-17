import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";

const Editor = ({ onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "यहाँ समाचार लिखें...",
      onChange: async () => {
        const content = await editorRef.current.save();
        onChange(content);
      },
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return <div id="editorjs" style={{ border: "1px solid #ddd", padding: 10 }} />;
};

export default Editor;
