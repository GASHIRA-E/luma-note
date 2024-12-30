import { useState } from "react";
import { Header } from "@/components/presentation/Header";

import { useEditorStore } from "@/utils/stores/editor";
import { getTagsQuery } from "@/utils/invoke/Tags";

type HeaderContainerProps = {
  ConfigMenuButton: () => React.ReactElement;
};

export const HeaderContainer = ({
  ConfigMenuButton,
}: HeaderContainerProps) => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const { setDisplayMode } = useEditorStore();
  const { data: tagsData } = getTagsQuery();

  const [isOpenSearchPopover, setIsSearchPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const handleClickClear = () => {
    setInputValue("");
    setSelectedTagIds([]);
    setIsSearchPopoverOpen(false);
  };

  const handleClose = () => {
    setIsSearchPopoverOpen(false);
  };

  const handleFocusTriggerInput = () => {
    setIsSearchPopoverOpen(true);
  };

  const handleClickTag = (id: number) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(selectedTagIds.filter((v) => v !== id));
    } else {
      setSelectedTagIds([...selectedTagIds, id]);
    }
  };

  const handleClickFilterButton = () => {
    // Implement the filter logic here
    console.log("Filtering with:", { inputValue, selectedTagIds });
    handleClose();
  };

  return (
    <Header
      editorDisplayModeValue={editorDisplayMode}
      setEditorDisplayMode={setDisplayMode}
      ConfigMenuButton={ConfigMenuButton}
      searchInput={{
        isOpen: isOpenSearchPopover,
        onFocusTriggerInput: handleFocusTriggerInput,
        onClose: handleClose,
        inputValue,
        setInputValue,
        allTags: tagsData?.tags || [],
        selectedTagIds,
        onClickTag: handleClickTag,
        onClickFilterButton: handleClickFilterButton,
        onClickClear: handleClickClear,
      }}
    />
  );
};
