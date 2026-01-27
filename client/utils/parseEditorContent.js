export const parseEditorContent = (content) => {
  if (!content) return null;

  // Already an object (new editor)
  if (typeof content === "object") {
    return content;
  }

  // String case
  if (typeof content === "string") {
    // Try JSON parse
    try {
      const parsed = JSON.parse(content);

      // Valid EditorJS structure
      if (parsed?.blocks) {
        return parsed;
      }

      // Parsed but not editor content
      return {
        blocks: [
          {
            type: "paragraph",
            data: { text: content },
          },
        ],
      };
    } catch (e) {
      // HTML or plain text (OLD posts)
      return {
        blocks: [
          {
            type: "paragraph",
            data: { text: content },
          },
        ],
      };
    }
  }

  return null;
};


