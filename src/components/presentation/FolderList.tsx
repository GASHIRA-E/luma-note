import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FolderItem } from "@/components/parts/FolderItem";

export type FolderListProps = {
  folderList: (Omit<
    React.ComponentProps<typeof FolderItem>,
    "onClick" | "selected"
  > & {
    folderId: number;
  })[];
  selectedFolderId: number | null;
  onClickNewFolder: () => void;
  onClickFolder: (folderId: number) => void;
};

export const FolderList = ({
  folderList,
  selectedFolderId,
  onClickNewFolder,
  onClickFolder,
}: FolderListProps) => {
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
      <Button w="full" mb={2} onClick={onClickNewFolder}>
        + 新規フォルダー
      </Button>
      <Flex direction="column" gap={2}>
        {folderList.map((folder) => (
          <FolderItem
            key={folder.folderId}
            name={folder.name}
            selected={folder.folderId === selectedFolderId}
            memoCounts={folder.memoCounts}
            onClick={() => onClickFolder(folder.folderId)}
          />
        ))}
      </Flex>
    </Box>
  );
};
