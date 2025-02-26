import { useState, useEffect, useMemo, createContext } from "react";
import { Flex } from "@chakra-ui/react";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { useDebounce } from "@/utils/hooks/useDebounce";

import MDEditor, { commands, type MDEditorProps } from "@uiw/react-md-editor";

import { Code } from "@/components/parts/editor/editorDisplay/Code";
import { AnchorTag } from "@/components/parts/editor/editorDisplay/AnchorTag";

// themeを保持するコンテキスト
export const AppSettingContext = createContext<{
  theme: AppTheme;
}>({
  theme: AppThemes.SYSTEM,
});

export type EditorDisplayProps = {
  mdText: string | undefined;
  theme: AppTheme;
  displayMode: DisplayMode;
  saveMdText: (mdText: string) => void;
};

export const EditorDisplay = ({
  mdText,
  theme,
  displayMode,
  saveMdText,
}: EditorDisplayProps) => {
  const [mdLocalText, setMdLocalText] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMdLocalText(mdText);
  }, [mdText]);

  const saveMdTextDebounce = useDebounce(
    (mdText: string) => {
      saveMdText(mdText);
    },
    {
      delay: 500,
    }
  );

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
      mermaid.initialize({
        theme: "dark",
        darkMode: true,
      });
    }
    if (theme === AppThemes.LIGHT) {
      document.documentElement.setAttribute("data-color-mode", "light");
      mermaid.initialize({
        theme: "default",
        darkMode: false,
      });
    }
    if (theme === AppThemes.SYSTEM) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-color-mode", "dark");
        mermaid.initialize({
          theme: "dark",
          darkMode: true,
        });
      } else {
        document.documentElement.setAttribute("data-color-mode", "light");
        mermaid.initialize({
          theme: "default",
          darkMode: false,
        });
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
    commands.divider,
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
    commands.divider,
    commands.link,
    commands.quote,
    commands.image,
    commands.table,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
  ];

  const handleChange: MDEditorProps["onChange"] = (value) => {
    // Add this condition
    setMdLocalText(value);
    if (value !== undefined) {
      saveMdTextDebounce(value);
    }
  };

  return (
    <AppSettingContext.Provider
      value={{
        theme,
      }}
    >
      <Flex flexGrow={1} overflow="hidden">
        <MDEditor
          value={mdLocalText}
          onChange={handleChange}
          height="100%"
          style={{
            width: "100%",
          }}
          preview={previewMode}
          commands={customCommands}
          previewOptions={{
            components: {
              a: AnchorTag,
              code: Code as any,
            },
          }}
        />
      </Flex>
    </AppSettingContext.Provider>
  );
};
