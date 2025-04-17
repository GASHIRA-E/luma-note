import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { useDebounce } from "@/utils/hooks/useDebounce";

import { Editor } from "@/components/parts/editor/Editor";
import { MarkdownPreview } from "@/components/parts/MarkdownPreview";

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

  useEffect(() => {
    if (theme === AppThemes.DARK) {
      document.documentElement.setAttribute("data-color-mode", "dark");
      mermaid.initialize({
        theme: "dark",
        darkMode: true,
      });
    } else if (theme === AppThemes.LIGHT) {
      document.documentElement.setAttribute("data-color-mode", "light");
      mermaid.initialize({
        theme: "default",
        darkMode: false,
      });
    } else if (theme === AppThemes.SYSTEM) {
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

  const handleChange: (value: string) => void = (value) => {
    if (value !== undefined) {
      saveMdTextDebounce(value);
    }
  };

  return (
    <Flex flexGrow={1} overflow="hidden">
      {(displayMode === DisplayModes.EDIT ||
        displayMode === DisplayModes.SPLIT) && (
        <div
          style={{
            width: displayMode === DisplayModes.SPLIT ? "50%" : "100%",
          }}
        >
          <Editor
            value={mdText || ""}
            onChange={handleChange}
            selectedMemoId={selectedMemoId}
          />
        </div>
      )}
      {(displayMode === DisplayModes.VIEW ||
        displayMode === DisplayModes.SPLIT) && (
        <div
          style={{
            width: displayMode === DisplayModes.SPLIT ? "50%" : "100%",
            overflowY: "scroll",
            minHeight: "100%",
          }}
        >
          <MarkdownPreview markdownText={mdText || ""} />
        </div>
      )}
    </Flex>
  );
};
