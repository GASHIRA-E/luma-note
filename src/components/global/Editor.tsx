import { Box } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { useState } from "react";

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
