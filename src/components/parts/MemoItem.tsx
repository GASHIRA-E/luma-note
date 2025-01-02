import { Box, Text, HStack, IconButton, Float, Circle } from "@chakra-ui/react";
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
  updatedAt: string;
  selected?: boolean;
  resultIcon?: boolean;
  onClickMoveFolder: (memoId: number) => void;
  onClickMemo: (memoId: number) => void; // Add this line
};

export const MemoItem = ({
  id,
  name,
  updatedAt,
  selected,
  resultIcon,
  onClickMoveFolder,
  onClickMemo,
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
            <IconButton size="xs" aria-label="More options" variant="outline">
              <HiDotsHorizontal />
            </IconButton>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="move-folder">フォルダ移動</MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>

      <Text color="fg.subtle" textStyle="sm">
        {updatedAt}
      </Text>
    </Box>
  );
};
