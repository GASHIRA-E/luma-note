import React from "react";
import { Box, Heading, Flex, IconButton } from "@chakra-ui/react";
import { HiPencilAlt } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { MemoItem } from "@/components/parts/MemoItem";
import { NewItemPopover } from "@/components/parts/NewItemContent";
import { ItemUpdateDialog } from "@/components/parts/ItemUpdateDialog";
import { DeleteItemConfirmDialog } from "@/components/parts/DeleteItemConfirmDialog";
import { MemoChangeFolderDialog } from "@/components/parts/memoList/MemoChangeFolderDialog";

interface MemoListProps {
  memos: React.ComponentProps<typeof MemoItem>[];
  onClickNewMemo: () => void;
  isPopoverOpen: boolean;
  setIsPopoverOpen: (isOpen: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  memoChangeFolderDialogProps: React.ComponentProps<
    typeof MemoChangeFolderDialog
  >;
  itemUpdateDialogProps: React.ComponentProps<typeof ItemUpdateDialog>;
  deleteItemConfirmDialogProps: React.ComponentProps<
    typeof DeleteItemConfirmDialog
  >;
  onClickQuickCreateMemo: () => void;
}

export const MemoList: React.FC<MemoListProps> = ({
  memos,
  onClickNewMemo,
  isPopoverOpen,
  setIsPopoverOpen,
  inputValue,
  setInputValue,
  memoChangeFolderDialogProps,
  itemUpdateDialogProps,
  deleteItemConfirmDialogProps,
  onClickQuickCreateMemo,
}) => {
  return (
    <Box
      w={240}
      maxH="100vh"
      overflowY="auto"
      px={3}
      pb={3}
      bg="bg"
      borderRightWidth={1}
      borderRightColor="border"
    >
      <Box position="sticky" top={0} zIndex={1} bg="bg" pt={3}>
        <Heading size="lg" mb={2}>
          Memo List
        </Heading>
        <Flex gap={1}>
          <NewItemPopover
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onClickCreate={onClickNewMemo}
            onKeyPressEnter={onClickNewMemo}
          >
            <Button flex={1} mb={2}>
              + 新規メモ
            </Button>
          </NewItemPopover>
          <IconButton onClick={onClickQuickCreateMemo}>
            <HiPencilAlt />
          </IconButton>
        </Flex>
      </Box>

      <Flex direction="column" gap={2} mt={3}>
        {memos.map((memo) => (
          <MemoItem key={memo.id} {...memo} />
        ))}
      </Flex>
      <MemoChangeFolderDialog {...memoChangeFolderDialogProps} />
      <ItemUpdateDialog {...itemUpdateDialogProps} />
      <DeleteItemConfirmDialog {...deleteItemConfirmDialogProps} />
    </Box>
  );
};
