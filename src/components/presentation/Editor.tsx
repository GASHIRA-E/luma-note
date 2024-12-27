import { useMemo, useState } from "react";
import { Box, Flex, Text, Input, Textarea } from "@chakra-ui/react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.min.css";
import "github-markdown-css";

import { Tag } from "@/components/ui/tag";
import { useScrollSync } from "@/utils/hooks/useScrollSync";

const marked = new Marked(
  markedHighlight({
    highlight: (code, lang) => {
      console.log(code, lang);
      const language = hljs.getLanguage(lang);
      if (!language?.name) {
        return hljs.highlightAuto(code).value;
      }

      return hljs.highlight(code, { language: language.name }).value;
    },
  })
);

export const Editor = () => {
  const { ref1, ref2 } = useScrollSync<HTMLTextAreaElement>();
  const [mdText, setMdText] = useState(`# Markdown Editor

## テスト

- リスト1
- リスト2
- リスト3

\`\`\`js
console.log("Hello, World!");
\`\`\`

\`\`\`css
body {
  background-color: #f0f0f0;
}
\`\`\`
`);

  const markdownHtml = useMemo(() => {
    return marked.parse(mdText);
  }, [mdText]);

  return (
    <Flex flex={1} height="100%" direction="column">
      {/* ファイル名とタグ */}
      <Box px="4" py="2">
        {/* ファイル名 */}
        <Text fontSize="xl">テストファイル1</Text>
        {/* 編集可能なタグ一覧 */}
        <Flex gap={2} alignItems="center">
          <Tag closable>タグ1</Tag>
          <Input
            placeholder="タグを追加"
            maxLength={12}
            width="60"
            list="tags"
          />
          <datalist id="tags">
            <option value="タグ3" />
            <option value="タグ4" />
            <option value="タグ5" />
          </datalist>
        </Flex>
      </Box>
      {/* テキスト側 */}
      <Flex flexGrow={1} overflow="hidden">
        <Textarea
          ref={ref1}
          style={{
            width: "50%",
            height: "100%",
            padding: "16px",
            fontSize: "16px",
            fontFamily: "monospace",
            overflowY: "auto",
            borderRadius: "0",
          }}
          onChange={(e) => setMdText(e.target.value)}
          // デザイン確認用に適当なmarkdownの初期値
          value={mdText}
        ></Textarea>
        <Box
          ref={ref2}
          borderTop="1px solid"
          borderColor="border.emphasized"
          className="markdown-body"
          style={{
            width: "50%",
            height: "100%",
            padding: "16px",
            overflowY: "auto",
          }}
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      </Flex>
    </Flex>
  );
};
