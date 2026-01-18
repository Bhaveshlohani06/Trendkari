// import editorJsHtml from "editorjs-html";

// const EditorContent = ({ content }) => {
//   if (!content) return null;

//   const editorData =
//     typeof content === "string" ? JSON.parse(content) : content;

//   const edjsParser = editorJsHtml();
//   const parsed = edjsParser.parse(editorData);

//   let html = "";

//   // 🧠 Handle every possible return type
//   if (Array.isArray(parsed)) {
//     html = parsed.join("");
//   } else if (typeof parsed === "string") {
//     html = parsed;
//   } else if (typeof parsed === "object") {
//     html = Object.values(parsed).flat().join("");
//   }

//   return (
//     <div
//       className="editor-content"
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// };

// export default EditorContent;


import editorJsHtml from "editorjs-html";

const edjsParser = editorJsHtml();

const safeParseEditorContent = (content) => {
  // 1️⃣ Already EditorJS object
  if (typeof content === "object" && content?.blocks) {
    return content;
  }

  // 2️⃣ JSON string (EditorJS saved as string)
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.blocks) return parsed;
    } catch (err) {
      // ❌ Not JSON → HTML or plain text
    }

    // 3️⃣ Old HTML → wrap as paragraph
    return {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: content,
          },
        },
      ],
      version: "2.28.0",
    };
  }

  return null;
};

const EditorContent = ({ content }) => {
  if (!content) return null;

  const editorData = safeParseEditorContent(content);
  if (!editorData) return null;

  const parsed = edjsParser.parse(editorData);

  let html = "";

  // 🧠 Handle ALL editorjs-html return formats
  if (Array.isArray(parsed)) {
    html = parsed.join("");
  } else if (typeof parsed === "string") {
    html = parsed;
  } else if (typeof parsed === "object") {
    html = Object.values(parsed).flat().join("");
  }

  return (
    <div
      className="editor-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default EditorContent;
