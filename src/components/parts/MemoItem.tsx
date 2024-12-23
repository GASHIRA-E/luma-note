import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

export type MemoItemProps = {
  id: number;
  name: string;
  tags: string[];
  updatedAt: string;
  selected?: boolean;
  onClickMoveFolder: (memoId: number) => void;
};

export const MemoItem = ({
  id,
  name,
  tags,
  updatedAt,
  selected,
  onClickMoveFolder,
}: MemoItemProps) => {
  const handleSelectMenu: React.ComponentProps<typeof MenuRoot>["onSelect"] = (
    select
  ) => {
    if (select.value === "move-folder") {
      onClickMoveFolder(id);
    }
  };
  return (
    <Box
      borderWidth={1}
      borderColor="border"
      bg={selected ? "bg.emphasized" : "bg.subtle"}
      p={2}
      borderRadius={2}
      cursor="pointer"
      transition="background-color 0.3s"
      _hover={{
        bg: "bg.emphasized",
      }}
    >
      <HStack justifyContent="space-between" alignItems="flex-start">
        <Text textStyle="md">{name}</Text>
        <MenuRoot onSelect={handleSelectMenu}>
          <MenuTrigger asChild>
            <IconButton size="xs" aria-label="More options" variant="outline">
              <HiDotsHorizontal />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="move-folder">フォルダ移動</MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>

      <Text textStyle="sm">{tags.map((v) => `#${v}`).join(" ")}</Text>
      <Text color="fg.subtle" textStyle="sm">
        {updatedAt}
      </Text>
    </Box>
  );
};
