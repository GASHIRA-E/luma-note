import {
  useState,
  useEffect,
  useCallback,
  Fragment,
  useRef,
  useContext,
} from "react";
import { getCodeString } from "rehype-rewrite";
import mermaid from "mermaid";

import { AppSettingContext } from "@/components/presentation/_EditArea/EditorDisplay";

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

export const Code = ({
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
