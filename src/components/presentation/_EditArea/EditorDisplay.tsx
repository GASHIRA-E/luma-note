import { useMemo } from "react";
import { Marked } from "marked";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { useScrollSync } from "@/utils/hooks/useScrollSync";

import "highlight.js/styles/github-dark.min.css";
import "github-markdown-css";

const marked = new Marked({
  ...markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) => {
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
  displayMode: DisplayMode;
  updateMdText: (mdText: string) => void;
};

export const EditorDisplay = ({
  mdText,
  displayMode,
  updateMdText,
}: EditorDisplayProps) => {
  const { ref1, ref2 } = useScrollSync<HTMLTextAreaElement>();

  const markdownHtml = useMemo(() => {
    return marked.parse(mdText);
  }, [mdText]);

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
        dangerouslySetInnerHTML={{ __html: markdownHtml }}
      />
    </Flex>
  );
};
