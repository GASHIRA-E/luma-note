import { Box, Heading, Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/components/parts/FileItem";

export const FileList = () => {
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
        File List
      </Heading>
      <Button w="full" mb={2}>
        + 新規メモ
      </Button>
      <Flex direction="column" gap={2}>
        {/* テストデータ */}
        <FileItem
          name="テストファイル1"
          tags={["タグ1"]}
          updatedAt="2024-09-20 20:15"
        />
        <FileItem
          name="テストファイル2"
          tags={["タグ2"]}
          updatedAt="2024-09-21 15:30"
        />
        <FileItem
          name="テストファイル3"
          tags={["タグ1", "タグ2"]}
          updatedAt="2024-09-23 22:15"
        />
      </Flex>
    </Box>
  );
};
