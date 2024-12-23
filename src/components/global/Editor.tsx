import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { Tag } from "@/components/ui/tag";

export const Editor = () => {
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
\`\`\``);

  return (
    <Box flex={1}>
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
      <Textarea
        style={{
          width: "100%",
          height: "100%",
          padding: "16px",
          fontSize: "16px",
          fontFamily: "monospace",
        }}
        onChange={(e) => setMdText(e.target.value)}
        // デザイン確認用に適当なmarkdownの初期値
        value={mdText}
      ></Textarea>
    </Box>
  );
};
