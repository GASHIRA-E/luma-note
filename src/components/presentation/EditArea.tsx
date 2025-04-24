import React from "react";
import { Flex } from "@chakra-ui/react";

import { EditorInfo } from "./_EditArea/EditorInfo";
import { EditorDisplay } from "./_EditArea/EditorDisplay";

export type EditAreaProps = {
  editorInfo: React.ComponentProps<typeof EditorInfo>;
  editorDisplay: React.ComponentProps<typeof EditorDisplay>;
};

export const EditArea = ({ editorInfo, editorDisplay }: EditAreaProps) => {
  return (
    <Flex
      flex={1}
      height="100%"
      direction="column"
      flexShrink={1}
      overflowX="hidden"
    >
      {/* ファイル名とタグ */}
      <EditorInfo {...editorInfo} />

      {/* テキスト側 */}
      <EditorDisplay {...editorDisplay} />
    </Flex>
  );
};
