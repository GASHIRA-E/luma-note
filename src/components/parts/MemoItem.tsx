import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Box, Text, HStack, IconButton, Float, Circle } from "@chakra-ui/react";
import {
  HiDotsHorizontal,
  HiFolderOpen,
  HiTrash,
  HiPencil,
  HiOutlineViewList,
} from "react-icons/hi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

export type MemoItemProps = {
  id: number;
  name: string;
  updatedAt: string;
  selected?: boolean;
  resultIcon?: boolean;
  onClickMoveFolder: (memoId: number) => void;
  onClickMemo: (memoId: number) => void;
  onClickRenameMemo: (memoId: number) => void;
  onClickDeleteMemo: (memoId: number) => void;
};

export const MemoItem = ({
  id,
  name,
  updatedAt,
  selected,
  resultIcon,
  onClickMoveFolder,
  onClickMemo,
  onClickRenameMemo,
  onClickDeleteMemo,
}: MemoItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const handleSelectMenu: React.ComponentProps<typeof MenuRoot>["onSelect"] = (
    select
  ) => {
    if (select.value === "move-folder") {
      onClickMoveFolder(id);
    } else if (select.value === "rename-memo") {
      onClickRenameMemo(id);
    } else if (select.value === "delete-memo") {
      onClickDeleteMemo(id);
    }
  };

  return (
    <Box
      position="relative"
      w="100%"
      boxShadow="sm"
      bg={selected ? "bg.subtle" : "bg"}
      p={1}
      cursor="pointer"
      as="button"
      textAlign="left"
      _hover={{
        bg: "bg.emphasized",
      }}
      onClick={() => {
        if (isDragging) return;
        onClickMemo(id);
      }}
      style={{
        transform: CSS.Transform.toString(transform),
      }}
      {...attributes}
      ref={setNodeRef}
    >
      {resultIcon ? (
        <Float placement="top-end">
          <Circle size={3} bg="teal.emphasized"></Circle>
        </Float>
      ) : null}
      <HStack justifyContent="space-between" alignItems="center">
        <IconButton
          size="xs"
          aria-label="move"
          variant="ghost"
          style={{
            cursor: "move",
          }}
          {...listeners}
        >
          <HiOutlineViewList />
        </IconButton>
        <Box w="100%">
          <Text textStyle="sm">{name}</Text>
          <Text color="fg.subtle" textStyle="xs">
            {updatedAt}
          </Text>
        </Box>
        <MenuRoot onSelect={handleSelectMenu}>
          <MenuTrigger asChild>
            <IconButton
              size="xs"
              aria-label="More options"
              variant="outline"
              onClick={(e) => e.stopPropagation()}
            >
              <HiDotsHorizontal />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              value="move-folder"
              cursor="pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <HiFolderOpen />
              <Box flex="1">フォルダ移動</Box>
            </MenuItem>
            <MenuItem
              value="rename-memo"
              cursor="pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <HiPencil />
              <Box flex="1">名前変更</Box>
            </MenuItem>
            <MenuItem
              value="delete-memo"
              cursor="pointer"
              color="fg.error"
              onClick={(e) => e.stopPropagation()}
            >
              <HiTrash />
              <Box flex="1">削除</Box>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>
    </Box>
  );
};
