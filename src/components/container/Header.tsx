import { useState } from "react";
import { Header } from "@/components/presentation/Header";

import { useEditorStore } from "@/utils/stores/editor";
import { getTagsQuery } from "@/utils/invoke/Tags";
import { findMemo } from "@/utils/invoke/Search";
import { useSearchStore } from "@/utils/stores/search";

type HeaderContainerProps = {
  ConfigMenuButton: () => React.ReactElement;
  toggleFolderListVisibility: (value: boolean) => void;
  toggleMemoListVisibility: (value: boolean) => void;
};

export const HeaderContainer = ({ 
  ConfigMenuButton, 
  toggleFolderListVisibility, 
  toggleMemoListVisibility 
}: HeaderContainerProps) => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const setDisplayMode = useEditorStore((state) => state.setDisplayMode);

  // タグ一覧
  const { data: tagsData } = getTagsQuery();

  // フォームに入力・設定されている値
  const [inputValue, setInputValue] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const hasSearched = useSearchStore((state) => state.hasSearched);
  // storeへ検索結果を格納
  const setSearchedResult = useSearchStore((state) => state.setSearchedResult);
  // storeから検索結果を削除
  const clearSearchedResult = useSearchStore(
    (state) => state.clearSearchedResult
  );

  const [isOpenSearchPopover, setIsSearchPopoverOpen] = useState(false);

  const handleClickClear = () => {
    setInputValue("");
    setSelectedTagIds([]);
    setIsSearchPopoverOpen(false);
    clearSearchedResult();
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
    findMemo({ memoTitle: inputValue, tags: selectedTagIds }).then((res) => {
      const resultMemos = res.map((file) => ({
        id: file.id,
        title: file.title,
        folderId: file.folder_id,
        updateAt: file.updated_at,
      }));
      setSearchedResult(resultMemos);
      handleClose();
    });
  };

  return (
    <Header
      editorDisplayModeValue={editorDisplayMode}
      setEditorDisplayMode={setDisplayMode}
      ConfigMenuButton={ConfigMenuButton}
      searchInput={{
        hasSearched,
        isOpen: isOpenSearchPopover,
        onFocusTriggerInput: handleFocusTriggerInput,
        onClose: handleClose,
        inputValue,
        setInputValue,
        allTags: tagsData || [],
        selectedTagIds,
        onClickTag: handleClickTag,
        onClickFilterButton: handleClickFilterButton,
        onClickClear: handleClickClear,
      }}
      toggleFolderListVisibility={toggleFolderListVisibility}
      toggleMemoListVisibility={toggleMemoListVisibility}
    />
  );
};
