import { Box, Text, Float, Circle, HStack, IconButton } from "@chakra-ui/react";
import { HiDotsHorizontal, HiTrash, HiPencil } from "react-icons/hi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

export type FolderProps = {
  folderId: number;
  name: string;
  selected?: boolean;
  memoCounts?: number;
  onClick: (folderId: number) => void;
  onClickDelete: (folderId: number) => void;
  onClickRename: (folderId: number) => void;
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
      borderColor="border"
      bg={selected ? "bg.emphasized" : "bg.subtle"}
      p={2}
      borderRadius={2}
      cursor="pointer"
      _hover={{
        borderColor: "border.inverted",
      }}
      onClick={selected ? undefined : handleClick}
    >
      {memoCounts !== undefined ? (
        <Float placement="top-end">
          <Circle size={5} bg="teal.emphasized">
            {memoCounts}
          </Circle>
        </Float>
      ) : null}
      <HStack justifyContent="space-between" alignItems="flex-start">
        <Text textStyle="md">{name}</Text>
        {folderId !== -1 && (
          <MenuRoot onSelect={handleSelectMenu}>
            <MenuTrigger asChild>
              <IconButton size="xs" aria-label="More options" variant="outline">
                <HiDotsHorizontal />
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="rename-folder" cursor="pointer">
                <HiPencil />
                <Box flex="1">名称変更</Box>
              </MenuItem>
              <MenuItem value="delete-folder" cursor="pointer" color="fg.error">
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
