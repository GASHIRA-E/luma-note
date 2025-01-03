import { Box, Text, HStack, IconButton, Float, Circle } from "@chakra-ui/react";
import {
  HiDotsHorizontal,
  HiFolderOpen,
  HiTrash,
  HiPencil,
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
      borderWidth={1}
      borderColor="border"
      bg={selected ? "bg.emphasized" : "bg.subtle"}
      p={2}
      borderRadius={2}
      cursor="pointer"
      _hover={{
        borderColor: "border.inverted",
      }}
      onClick={() => onClickMemo(id)}
    >
      {resultIcon ? (
        <Float placement="top-end">
          <Circle size={3} bg="teal.emphasized"></Circle>
        </Float>
      ) : null}
      <HStack justifyContent="space-between" alignItems="flex-start">
        <Text textStyle="md">{name}</Text>
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

      <Text color="fg.subtle" textStyle="sm">
        {updatedAt}
      </Text>
    </Box>
  );
};
