import { Header } from "@/components/presentation/Header";

import { useEditorStore } from "@/utils/stores/editor";

type HeaderContainerProps = {
  ConfigMenuButton: () => React.ReactElement;
};

export const HeaderContainer = ({
  ConfigMenuButton,
}: HeaderContainerProps) => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const { setDisplayMode } = useEditorStore();

  return (
    <Header
      editorDisplayModeValue={editorDisplayMode}
      setEditorDisplayMode={setDisplayMode}
      ConfigMenuButton={ConfigMenuButton}
    />
  );
};
