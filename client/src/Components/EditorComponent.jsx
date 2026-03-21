// import EditorJS from "@editorjs/editorjs";
// import { useEffect, useRef } from "react";

// const Editor = ({ onChange, initialData = null }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current) return;

//     editorRef.current = new EditorJS({
//       holder: "editorjs",
//       placeholder: "यहाँ अपनी बात लिखें...",
//       data: initialData, // ✅ for edit post

//       async onChange() {
//         const savedData = await editorRef.current.save();
//         onChange(savedData); // 🔥 ALWAYS object
//       },
//     });

//     return () => {
//       editorRef.current?.destroy();
//       editorRef.current = null;
//     };
//   }, [initialData, onChange]);

//   return (
//     <div
//       id="editorjs"
//       style={{
//         border: "1px solid #ddd",
//         padding: "10px",
//         borderRadius: "6px",
//       }}
//     />
//   );
// };

// export default Editor;





import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import { useEffect, useRef } from "react";

const EDITOR_TOOLS = {
  header: Header,
  list: List,
  image: ImageTool,
};

// const Editor = ({ onChange, initialData = null }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current) return;

//     editorRef.current = new EditorJS({
//       holder: "editorjs",
//       placeholder: "यहाँ अपनी बात लिखें...",
//       data: initialData || {
//         blocks: [
//           {
//             type: "paragraph",
//             data: { text: "" },
//           },
//         ],
//       },
//       tools: EDITOR_TOOLS,
//       autofocus: true,
//       async onChange() {
//         try {
//           const savedData = await editorRef.current.save();
//           onChange(savedData); // ALWAYS object
//         } catch (err) {
//           console.error("EditorJS save failed:", err);
//         }
//       },
//     });

//     return () => {
//       editorRef.current?.destroy();
//       editorRef.current = null;
//     };
//   }, [initialData, onChange]);

//   return (
//     <div
//       id="editorjs"
//       style={{
//         border: "1px solid #ddd",
//         padding: "10px",
//         borderRadius: "6px",
//         minHeight: "250px",
//         background: "#fff",
//       }}
//     />
//   );
// };

const Editor = ({ onChange, initialData }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Destroy previous instance if exists
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    editorRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "यहाँ अपनी बात लिखें...",
      data: initialData || {
        blocks: [
          {
            type: "paragraph",
            data: { text: "" },
          },
        ],
      },
      tools: EDITOR_TOOLS,
      autofocus: true,
      async onChange() {
        try {
          const savedData = await editorRef.current.save();
          onChange(savedData);
        } catch (err) {
          console.error("EditorJS save failed:", err);
        }
      },
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [initialData]); // 🔥 depend on initialData

  return (
    <div
      id="editorjs"
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "6px",
        minHeight: "250px",
        background: "#fff",
      }}
    />
  );
};

export default Editor;
