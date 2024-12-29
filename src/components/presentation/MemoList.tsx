import { Box, Heading, Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MemoItem } from "@/components/parts/MemoItem";

export const MemoList = () => {
  const onClickMoveFolder = (memoId: number) => {
    alert(memoId);
  };

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
      <Button w="full" mb={2}>
        + 新規メモ
      </Button>
      <Flex direction="column" gap={2}>
        {/* テストデータ */}
        <MemoItem
          id={1}
          name="テストファイル1"
          tags={["タグ1"]}
          updatedAt="2024-09-20 20:15"
          selected
          onClickMoveFolder={onClickMoveFolder}
        />
        <MemoItem
          id={2}
          name="テストファイル2-長い名前のファイル名-長い名前のファイル名"
          tags={["タグ2"]}
          updatedAt="2024-09-21 15:30"
          onClickMoveFolder={onClickMoveFolder}
        />
        <MemoItem
          id={3}
          name="テストファイル3"
          tags={["タグ1", "タグ2"]}
          updatedAt="2024-09-23 22:15"
          onClickMoveFolder={onClickMoveFolder}
        />
      </Flex>
    </Box>
  );
};
