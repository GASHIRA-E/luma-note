import { useState, useEffect } from "react";
import { Header } from "@/components/presentation/Header";

import { useEditorStore } from "@/utils/stores/editor";
import { getTagsQuery } from "@/utils/invoke/Tags";
import { findMemoQuery } from "@/utils/invoke/Search";
import { useSearchStore } from "@/utils/stores/search";

type HeaderContainerProps = {
  ConfigMenuButton: () => React.ReactElement;
};

export const HeaderContainer = ({ ConfigMenuButton }: HeaderContainerProps) => {
  const editorDisplayMode = useEditorStore((state) => state.displayMode);
  const setDisplayMode = useEditorStore((state) => state.setDisplayMode);

  // タグ一覧
  const { data: tagsData } = getTagsQuery();

  // フォームに入力・設定されている値
  const [inputValue, setInputValue] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // 検索実行中の値
  const [searchedMemoTitle, setSearchedMemoTitle] = useState<string>("");
  const [searchedTagIds, setSearchedTagIds] = useState<number[]>([]);

  // storeへ検索結果を格納
  const setSearchedResult = useSearchStore((state) => state.setSearchedResult);
  // storeから検索結果を削除
  const clearSearchedResult = useSearchStore(
    (state) => state.clearSearchedResult
  );

  const { data: findMemoData, isPending } = findMemoQuery({
    memo_title: searchedMemoTitle,
    tags: searchedTagIds,
  });

  // 検索結果が更新されたら返還を行いstoreへ格納
  useEffect(() => {
    if (findMemoData && !isPending) {
      const result = findMemoData.files.map((file) => ({
        id: file.id,
        title: file.title,
        folderId: file.folder_id,
        updateAt: file.updated_at,
      }));
      setSearchedResult(result);
    }
  }, [findMemoData, isPending]);

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
    // Implement the filter logic here
    console.log("Filtering with:", { inputValue, selectedTagIds });
    setSearchedMemoTitle(inputValue);
    setSearchedTagIds(selectedTagIds);
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
