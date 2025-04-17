import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-light.css";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";

import type { ClassAttributes, HTMLAttributes } from "react";
import type { ExtraProps } from "react-markdown";

type MarkdownPreviewProps = {
  markdownText: string;
};

const Pre = ({
  children,
  ...props
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) => {
  if (!children || typeof children !== "object") {
    return <code {...props}>{children}</code>;
  }
  const childType = "type" in children ? children.type : "";
  if (childType !== "code") {
    return <code {...props}>{children}</code>;
  }

  const childProps = "props" in children ? children.props : {};
  const { className, children: code } = childProps;
  const language = className?.replace("language-", "");

  return (
    <SyntaxHighlighter language={language}>
      {String(code).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: Pre,
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </article>
  );
};
