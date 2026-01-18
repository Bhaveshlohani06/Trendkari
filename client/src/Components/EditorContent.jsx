import editorJsHtml from "editorjs-html";

const EditorContent = ({ content }) => {
  if (!content) return null;

  const editorData =
    typeof content === "string" ? JSON.parse(content) : content;

  const edjsParser = editorJsHtml();
  const parsed = edjsParser.parse(editorData);

  let html = "";

  // 🧠 Handle every possible return type
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
