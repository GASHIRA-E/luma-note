import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent
} from "@dnd-kit/core";
import { Box } from "@chakra-ui/react";

import { FolderList } from "@/components/container/FolderList";
import { MemoListContainer } from "@/components/container/MemoList";
import { EditArea } from "@/components/container/EditArea";
import { MemoItem } from "@/components/parts/MemoItem";

import { getMemoListQuery } from "@/utils/invoke/Memo";
import { useFolderStore } from "@/utils/stores/folder";

export const EditorContainer = () => {
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const { data } = getMemoListQuery({
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

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <section className="editor-container">
        <FolderList />
        <MemoListContainer />
        <DragOverlay>
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
