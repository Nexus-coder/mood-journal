/**
 * Utility to extract plain text from Tiptap JSON or return the string if it's already plain text.
 */
export function getPlainText(content: string): string {
  if (!content) return "";
  
  try {
    const json = JSON.parse(content);
    
    // Check if it's a Tiptap JSON structure
    if (json.type === "doc" && Array.isArray(json.content)) {
      return extractTextFromNodes(json.content);
    }
    
    return content;
  } catch (e) {
    // Not JSON, return as is
    return content;
  }
}

function extractTextFromNodes(nodes: any[]): string {
  return nodes
    .map((node) => {
      if (node.text) {
        return node.text;
      }
      if (node.content) {
        return extractTextFromNodes(node.content);
      }
      if (node.type === "paragraph" || node.type === "heading") {
        return "\n"; // Basic line break handling
      }
      return "";
    })
    .join("")
    .replace(/\n\n+/g, "\n") // Clean up double breaks
    .trim();
}
