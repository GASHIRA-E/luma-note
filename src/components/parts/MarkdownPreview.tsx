import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-light.css";

type MarkdownPreviewProps = {
  markdownText: string;
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdownText,
}) => {
  return (
    <article
      className="markdown-body"
      style={{
        minHeight: "100%",
        borderLeft: "1px solid #aeaeae",
        padding: "16px",
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownText}</ReactMarkdown>
    </article>
  );
};
