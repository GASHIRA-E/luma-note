import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css/github-markdown-light.css";
import "./markdownPreview.css";

type MarkdownPreviewProps = {
  markdownText: string;
};

type MermaidProps = {
  code: string;
};

export const Mermaid: React.FC<MermaidProps> = (props) => {
  const { code } = props;
  const outputRef = React.useRef<HTMLDivElement>(null);

  const render = React.useCallback(async () => {
    if (outputRef.current && code) {
      try {
        // ① 一意な ID を指定する必要あり
        const { svg } = await mermaid.render(`m${crypto.randomUUID()}`, code);
        outputRef.current.innerHTML = svg;
      } catch (error) {
        console.warn(error);
        outputRef.current.innerHTML = "Invalid syntax";
      }
    }
  }, [code]);

  React.useEffect(() => {
    render();
  }, [render]);

  return code ? (
    <div style={{ backgroundColor: "#fff" }}>
      <div ref={outputRef} />
    </div>
  ) : null;
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
          code({ node, className, children, ref, ...props }) {
            if (
              className === "language-mermaid" &&
              node?.children[0].type === "text"
            ) {
              return <Mermaid code={node?.children[0].value} />;
            } else {
              const match = /language-(\w+)/.exec(className || "");

              return match ? (
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={prism as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className}>{children}</code>
              );
            }
          },
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </article>
  );
};
