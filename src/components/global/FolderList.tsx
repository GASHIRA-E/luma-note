import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FolderItem } from "@/components/parts/FolderItem";

export const FolderList = () => {
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
        Folder List
      </Heading>
      <Button w="full" mb={2}>
        + 新規フォルダー
      </Button>
      <Flex direction="column" gap={2}>
        <FolderItem name="Folder 1" selected={true} />
        <FolderItem
          name="長い名前のフォルダー長い名前のフォルダー2"
          selected={false}
        />
        <FolderItem name="Folder 3" selected={false} />
      </Flex>
    </Box>
  );
};
