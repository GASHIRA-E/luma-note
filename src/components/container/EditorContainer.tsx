import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Box } from "@chakra-ui/react";

import { FolderList } from "@/components/container/FolderList";
import { MemoListContainer } from "@/components/container/MemoList";
import { EditArea } from "@/components/container/EditArea";
import { MemoItem } from "@/components/parts/MemoItem";

import { getMemoListQuery, updateMemoMutation } from "@/utils/invoke/Memo";
import { useFolderStore } from "@/utils/stores/folder";
import { useQueryClient } from "@tanstack/react-query";
import { generateNullableId } from "@/utils/helpers/generateNullableId";

export const EditorContainer = () => {
  const queryClient = useQueryClient();
  const [customDropAnimation, setCustomDropAnimation] = useState<
    null | undefined
  >(undefined);
  const { mutateAsync: updateMemoMutateAsync } =
    updateMemoMutation(queryClient);

  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const { data, refetch: refetchGetMemoList } = getMemoListQuery({
    folderId: selectedFolderId,
  });

  const [draggingItem, setDraggingItem] = useState<{
    memoId: number;
    memoName: string;
    memoUpdatedAt: string;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const memoId = Number(event.active.id);
    if (isNaN(memoId)) return;

    const memo = data?.find((memo) => memo.id === memoId);
    if (!memo) return;

    setDraggingItem({
      memoId: memo.id,
      memoName: memo.title,
      memoUpdatedAt: memo.updated_at,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // メモをdropして、フォルダが存在する場合は所属フォルダを移動する
    const memoId = Number(event.active.id);
    if (isNaN(memoId)) return;
    const folderId = Number(event.over?.id);
    if (isNaN(folderId)) return;

    setCustomDropAnimation(null);

    updateMemoMutateAsync({
      memo: {
        id: memoId,
        folder_id: generateNullableId(folderId),
      },
    })
      .then(() => {
        refetchGetMemoList();
      })
      .finally(() => {
        setDraggingItem(null);
        setCustomDropAnimation(undefined);
      });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <section className="editor-container">
        <FolderList />
        <MemoListContainer />
        <DragOverlay dropAnimation={customDropAnimation}>
          {draggingItem && (
            <Box w={240}>
              <MemoItem
                id={draggingItem.memoId}
                name={draggingItem.memoName}
                updatedAt={draggingItem.memoUpdatedAt}
                onClickMemo={() => {}}
                onClickMoveFolder={() => {}}
                onClickRenameMemo={() => {}}
                onClickDeleteMemo={() => {}}
              />
            </Box>
          )}
        </DragOverlay>
        <EditArea />
      </section>
    </DndContext>
  );
};
