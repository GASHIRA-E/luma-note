import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { HiPencilAlt } from "react-icons/hi";

import { FolderItem } from "@/components/parts/FolderItem";
import { NewItemPopover } from "@/components/parts/NewItemContent";
import { ItemUpdateDialog } from "@/components/parts/ItemUpdateDialog";
import { DeleteItemConfirmDialog } from "@/components/parts/DeleteItemConfirmDialog";

export type FolderListProps = {
  folderList: React.ComponentProps<typeof FolderItem>[];
  isPopoverOpen: boolean;
  setIsPopoverOpen: (value: boolean) => void;
  newFolderName: string;
  setNewFolderName: (value: string) => void;
  onClickCreateFolder: React.MouseEventHandler<HTMLButtonElement>;
  itemUpdateDialogProps: React.ComponentProps<typeof ItemUpdateDialog>;
  deleteItemConfirmDialogProps: React.ComponentProps<
    typeof DeleteItemConfirmDialog
  >;
  onClickQuickCreateFolder: React.MouseEventHandler<HTMLButtonElement>;
};

export const FolderList = ({
  folderList,
  isPopoverOpen,
  setIsPopoverOpen,
  newFolderName,
  setNewFolderName,
  onClickCreateFolder,
  itemUpdateDialogProps,
  deleteItemConfirmDialogProps,
  onClickQuickCreateFolder,
}: FolderListProps) => {
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
          Folder List
        </Heading>
        <Flex gap={1}>
          <NewItemPopover
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            inputValue={newFolderName}
            setInputValue={setNewFolderName}
            onClickCreate={onClickCreateFolder}
          >
            <Button flex={1} mb={2}>
              + 新規フォルダー
            </Button>
          </NewItemPopover>
          <IconButton onClick={onClickQuickCreateFolder}>
            <HiPencilAlt />
          </IconButton>
        </Flex>
      </Box>
      <Flex direction="column" gap={2} mt={3}>
        {folderList.map((folder) => (
          <FolderItem key={`folder-list-${folder.folderId}`} {...folder} />
        ))}
      </Flex>
      <ItemUpdateDialog {...itemUpdateDialogProps} />
      <DeleteItemConfirmDialog {...deleteItemConfirmDialogProps} />
    </Box>
  );
};
