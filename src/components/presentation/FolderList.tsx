import { Box, Flex, IconButton } from "@chakra-ui/react";
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
  onCreateFolder: () => void;
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
  onCreateFolder,
  itemUpdateDialogProps,
  deleteItemConfirmDialogProps,
  onClickQuickCreateFolder,
}: FolderListProps) => {
  return (
    <Box
      w={220}
      maxH="100vh"
      overflowY="auto"
      pb={3}
      bg="bg"
      borderRightWidth={1}
      borderRightColor="border"
    >
      <Box position="sticky" top={0} zIndex={1} bg="bg" pt={3}>
        <Flex gap={1} px={2}>
          <NewItemPopover
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            inputValue={newFolderName}
            setInputValue={setNewFolderName}
            onClickCreate={onCreateFolder}
            onKeyPressEnter={onCreateFolder}
          >
            <Button flex={1} mb={2}>
              + New Folder
            </Button>
          </NewItemPopover>
          <IconButton onClick={onClickQuickCreateFolder}>
            <HiPencilAlt />
          </IconButton>
        </Flex>
      </Box>
      <Flex direction="column" mt={3} gap={1}>
        {folderList.map((folder) => (
          <FolderItem key={`folder-list-${folder.folderId}`} {...folder} />
        ))}
      </Flex>
      <ItemUpdateDialog {...itemUpdateDialogProps} />
      <DeleteItemConfirmDialog {...deleteItemConfirmDialogProps} />
    </Box>
  );
};
