import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
  useRef,
  useContext,
  createContext,
} from "react";
import { Flex } from "@chakra-ui/react";
import { getCodeString } from "rehype-rewrite";
import mermaid from "mermaid";

import { DisplayModes, type DisplayMode } from "@/utils/constants";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { useDebounce } from "@/utils/hooks/useDebounce";

import MDEditor, { commands, type MDEditorProps } from "@uiw/react-md-editor";

// themeを保持するコンテキスト
const AppSettingContext = createContext<{
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

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({
  inline,
  children = [],
  className,
  ...props
}: {
  inline?: boolean;
  children?: string[];
  className?: string;
  node?: {
    children: any[];
  };
}) => {
  const { theme } = useContext(AppSettingContext);
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const isMermaid =
    className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code: string =
    props.node && props.node.children
      ? getCodeString(props.node.children)
      : children[0] || "";

  const reRender = async () => {
    if (container && isMermaid) {
      try {
        const str = await mermaid.render(demoid.current, code);
        container.innerHTML = str.svg;
      } catch (error) {
        container.innerHTML = String(error);
      }
    }
  };

  useEffect(() => {
    reRender();
  }, [container, isMermaid, code, demoid, theme]);

  const refElement = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code className={className}>{children}</code>;
};

// 引用: https://qiita.com/wataru775/items/61db1371655897aea517 (感謝)
const AnchorTag = ({ node, children, ...props }: any) => {
  try {
    new URL(props.href ?? "");
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  } catch (e) {}
  return <a {...props}>{children}</a>;
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
          height={"100%"}
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
