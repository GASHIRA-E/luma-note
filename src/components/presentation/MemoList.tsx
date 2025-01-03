import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { MemoItem } from "@/components/parts/MemoItem";
import { NewItemPopover } from "@/components/parts/NewItemContent";

interface MemoListProps {
  memos: React.ComponentProps<typeof MemoItem>[];
  onClickNewMemo: () => void;
  isPopoverOpen: boolean;
  setIsPopoverOpen: (isOpen: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const MemoList: React.FC<MemoListProps> = ({
  memos,
  onClickNewMemo,
  isPopoverOpen,
  setIsPopoverOpen,
  inputValue,
  setInputValue,
}) => {
  return (
    <Box
      w={240}
      maxH="100vh"
      overflowY="auto"
      p={3}
      bg="bg"
      borderRightWidth={1}
      borderRightColor="border"
    >
      <Heading size="lg" mb={2}>
        Memo List
      </Heading>
      <NewItemPopover
        isPopoverOpen={isPopoverOpen}
        setIsPopoverOpen={setIsPopoverOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onClickCreate={onClickNewMemo}
      >
        <Button w="full" mb={2}>
          + 新規メモ
        </Button>
      </NewItemPopover>
      <Flex direction="column" gap={2}>
        {memos.map((memo) => (
          <MemoItem key={memo.id} {...memo} />
        ))}
      </Flex>
    </Box>
  );
};
