import { Header } from "@/components/presentation/Header";

import { useEditorStore } from "@/utils/stores/editor";

export const HeaderContainer = () => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const { setDisplayMode } = useEditorStore();

  return (
    <Header
      editorDisplayModeValue={editorDisplayMode}
      setEditorDisplayMode={setDisplayMode}
    />
  );
};
