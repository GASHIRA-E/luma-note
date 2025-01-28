import React, { useEffect, useMemo } from "react";
// import { Marked } from "marked";
import { Flex } from "@chakra-ui/react";
// import { markedHighlight } from "marked-highlight";
// import hljs from "highlight.js";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { AppThemes, type AppTheme } from "@/utils/constants";

import MDEditor, { commands } from "@uiw/react-md-editor";

export type EditorDisplayProps = {
  mdText: string | undefined;
  theme: AppTheme;
  displayMode: DisplayMode;
  setMdText: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const EditorDisplay = ({
  mdText,
  theme,
  displayMode,
  setMdText,
}: EditorDisplayProps) => {
  useEffect(() => {
    mermaid.initialize({
      securityLevel: "loose",
      theme: "dark",
      darkMode: true,
    });
  }, []);

  // テーマ切り替え時にエディターのテーマを変更
  useEffect(() => {
    if (theme === AppThemes.DARK) {
      document.documentElement.setAttribute("data-color-mode", "dark");
    }
    if (theme === AppThemes.LIGHT) {
      document.documentElement.setAttribute("data-color-mode", "light");
    }
    if (theme === AppThemes.SYSTEM) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-color-mode", "dark");
      } else {
        document.documentElement.setAttribute("data-color-mode", "light");
      }
    }
  }, [theme]);

  const previewMode = useMemo<"live" | "edit" | "preview">(() => {
    switch (displayMode) {
      case DisplayModes.EDIT:
        return "edit";
      case DisplayModes.SPLIT:
        return "live";
      case DisplayModes.VIEW:
        return "preview";
      default:
        return "edit";
    }
  }, [displayMode]);

  const customCommands: commands.ICommand[] = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.title,
    commands.divider,
    commands.link,
    commands.quote,
    commands.image,
    commands.table,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
  ];

  return (
    <Flex flexGrow={1} overflow="hidden">
      <MDEditor
        value={mdText}
        onChange={setMdText}
        height={"100%"}
        style={{
          width: "100%",
        }}
        preview={previewMode}
        commands={customCommands}
      />
    </Flex>
  );
};
