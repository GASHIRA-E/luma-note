import { Box, Heading, Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MemoItem } from "@/components/parts/MemoItem";

interface MemoListProps {
  memos: Array<{
    id: number;
    name: string;
    updatedAt: string;
  }>;
  selectedMemoId: number | null;
  onClickMoveFolder: (memoId: number) => void;
  onClickNewMemo: () => void;
  onClickMemo: (memoId: number) => void;
}

export const MemoList: React.FC<MemoListProps> = ({
  memos,
  selectedMemoId,
  onClickMoveFolder,
  onClickNewMemo,
  onClickMemo,
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
      <Button w="full" mb={2} onClick={onClickNewMemo}>
        + 新規メモ
      </Button>
      <Flex direction="column" gap={2}>
        {memos.map((memo) => (
          <MemoItem
            key={memo.id}
            id={memo.id}
            name={memo.name}
            updatedAt={memo.updatedAt}
            selected={memo.id === selectedMemoId}
            onClickMoveFolder={onClickMoveFolder}
            onClickMemo={onClickMemo}
          />
        ))}
      </Flex>
    </Box>
  );
};
