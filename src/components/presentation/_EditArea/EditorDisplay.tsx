import { useEffect, useMemo, useState } from "react";
import { Marked } from "marked";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { useScrollSync } from "@/utils/hooks/useScrollSync";
import { type AppTheme } from "@/utils/constants";

import "highlight.js/styles/github-dark.min.css";

import "github-markdown-css/github-markdown.css";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";

const marked = new Marked({
  ...markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) => {
      if (lang === "mermaid") {
        return `<div class="mermaid">${code}</div>`;
      }
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language: language }).value;
    },
  }),
  renderer: {
    link: ({ href, text }) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
});

export type EditorDisplayProps = {
  mdText: string;
  theme: AppTheme;
  displayMode: DisplayMode;
  updateMdText: (mdText: string) => void;
};

export const EditorDisplay = ({
  mdText,
  theme,
  displayMode,
  updateMdText,
}: EditorDisplayProps) => {
  const { ref1, ref2 } = useScrollSync<HTMLTextAreaElement>();

  useEffect(() => {
    mermaid.initialize({
      securityLevel: "loose",
      theme: "dark",
      darkMode: true,
    });
  }, []);

  useEffect(() => {
    // 既存のCSSを削除
    document.head.querySelectorAll("#app-theme-css").forEach((el) => {
      el.remove();
    });
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.id = "app-theme-css";
    cssLink.type = "text/css";

    switch (theme) {
      case "light":
        cssLink.href =
          "node_modules/github-markdown-css/github-markdown-light.css";
        break;
      case "dark":
        cssLink.href =
          "node_modules/github-markdown-css/github-markdown-dark.css";
        break;
      default:
        cssLink.href = "node_modules/github-markdown-css/github-markdown.css";
        break;
    }
    document.head.appendChild(cssLink);

    mermaid.initialize({
      darkMode: theme === "dark",
    });
  }, [theme]);

  const [mdHtml, setMdHtml] = useState("");
  const markdownHtml = useMemo(() => {
    const str = marked.parse(mdText);
    if (typeof str === "string") {
      setMdHtml(str);
    } else {
      str.then((res) => {
        setMdHtml(res);
      });
    }
  }, [mdText]);

  useEffect(() => {
    mermaid.run();
  }, [markdownHtml]);

  return (
    <Flex flexGrow={1} overflow="hidden">
      <Textarea
        ref={ref1}
        display={displayMode === DisplayModes.VIEW ? "none" : "block"}
        width={displayMode === DisplayModes.EDIT ? "100%" : "50%"}
        style={{
          height: "100%",
          padding: "16px",
          fontSize: "16px",
          fontFamily: "monospace",
          overflowY: "auto",
          borderRadius: "0",
        }}
        focusRing="none"
        css={{
          "&:focus": {
            borderColor: "transparent",
          },
        }}
        variant="subtle"
        onChange={(e) => updateMdText(e.target.value)}
        // デザイン確認用に適当なmarkdownの初期値
        value={mdText}
      ></Textarea>
      <Box
        ref={ref2}
        borderTop="1px solid"
        borderColor="border.emphasized"
        className="markdown-body"
        display={displayMode === DisplayModes.EDIT ? "none" : "block"}
        width={displayMode === DisplayModes.VIEW ? "100%" : "50%"}
        style={{
          height: "100%",
          padding: "16px",
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: mdHtml }}
      />
    </Flex>
  );
};
