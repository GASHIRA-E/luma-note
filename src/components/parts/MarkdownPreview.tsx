import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownPreviewProps = {
  markdownText: string;
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdownText }) => {
  return (
    <div className="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownText}</ReactMarkdown>
    </div>
  );
};
