import { Box, Text, Float, Circle, HStack, IconButton } from "@chakra-ui/react";
import {
  HiDotsHorizontal,
  HiTrash,
  HiPencil,
  HiOutlineFolder,
} from "react-icons/hi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useDroppable } from "@dnd-kit/core";

export type FolderProps = {
  folderId: number | null;
  name: string;
  selected?: boolean;
  memoCounts?: number;
  onClick: (folderId: number | null) => void;
  onClickDelete: (folderId: number | null) => void;
  onClickRename: (folderId: number | null) => void;
};

export const FolderItem = ({
  folderId,
  name,
  selected,
  memoCounts,
  onClick,
  onClickDelete,
  onClickRename,
}: FolderProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folderId?.toString() ?? "null"}`,
  });

  const handleClick = () => {
    onClick(folderId);
  };

  const handleSelectMenu: React.ComponentProps<typeof MenuRoot>["onSelect"] = (
    select
  ) => {
    if (select.value === "delete-folder") {
      onClickDelete(folderId);
    } else if (select.value === "rename-folder") {
      onClickRename(folderId);
    }
  };

  return (
    <Box
      position="relative"
      borderWidth={1}
      borderColor={isOver ? "border.inverted" : "bg.subtle"}
      transition="border-color 0.2s ease-in-out"
      bg={selected ? "bg.emphasized" : "bg.subtle"}
      p={2}
      cursor="pointer"
      _hover={{
        borderColor: "border.inverted",
      }}
      onClick={selected ? undefined : handleClick}
      ref={setNodeRef}
    >
      {memoCounts !== undefined ? (
        <Float placement="top-end" offsetX={3}>
          <Circle size={5} bg="teal.emphasized">
            {memoCounts}
          </Circle>
        </Float>
      ) : null}
      <HStack justifyContent="space-between" alignItems="center">
        <HStack spaceX={1}>
          <Box>
            <HiOutlineFolder />
          </Box>
          <Text wordBreak="break-all" textStyle="sm">
            {name}
          </Text>
        </HStack>
        {folderId !== null && (
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
                value="rename-folder"
                cursor="pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <HiPencil />
                <Box flex="1">名称変更</Box>
              </MenuItem>
              <MenuItem
                value="delete-folder"
                cursor="pointer"
                color="fg.error"
                onClick={(e) => e.stopPropagation()}
              >
                <HiTrash />
                <Box flex="1">削除</Box>
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        )}
      </HStack>
    </Box>
  );
};
