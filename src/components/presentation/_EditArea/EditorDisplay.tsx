import { useEffect, useMemo, createContext } from "react";
import { Flex } from "@chakra-ui/react";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { useDebounce } from "@/utils/hooks/useDebounce";

import { Editor } from "@/components/parts/editor/Editor";
import { MarkdownPreview } from "@/components/parts/MarkdownPreview";

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
  selectedMemoId?: number;
  saveMdText: (mdText: string) => void;
};

export const EditorDisplay = ({
  mdText,
  theme,
  displayMode,
  selectedMemoId,
  saveMdText,
}: EditorDisplayProps) => {
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

  const handleChange: (value: string) => void = (value) => {
    // Add this condition
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
      {previewMode === "edit" && (
        <Flex flexGrow={1} overflow="hidden">
          <Editor
            value={mdText || ""}
            onChange={handleChange}
            selectedMemoId={selectedMemoId}
          />
        </Flex>
      )}

      {previewMode === "live" && (
        <Flex flexGrow={1} overflow="hidden">
          <div style={{ width: "50%", height: "100%" }}>
            <Editor
              value={mdText || ""}
              onChange={handleChange}
              selectedMemoId={selectedMemoId}
            />
          </div>
          <div style={{ width: "50%", height: "100%", overflowY: "scroll" }}>
            <MarkdownPreview markdownText={mdText || ""} />
          </div>
        </Flex>
      )}

      {previewMode === "preview" && (
        <Flex flexGrow={1} overflow="hidden">
          <MarkdownPreview markdownText={mdText || ""} />
        </Flex>
      )}
    </AppSettingContext.Provider>
  );
};
