import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FolderItem } from "@/components/parts/FolderItem";
import { NewItemContent } from "@/components/parts/NewItemContent";
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
  deleteItemConfirmDialogProps: React.ComponentProps<typeof DeleteItemConfirmDialog>;
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
      <PopoverRoot
        open={isPopoverOpen}
        onOpenChange={(e) => setIsPopoverOpen(e.open)}
      >
        <PopoverTrigger asChild>
          <Button w="full" mb={2}>
            + 新規フォルダー
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <NewItemContent
              inputValue={newFolderName}
              setInputValue={setNewFolderName}
              onClickCreate={onClickCreateFolder}
            />
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      <Flex direction="column" gap={2}>
        {folderList.map((folder) => (
          <FolderItem key={folder.folderId} {...folder} />
        ))}
      </Flex>
      <ItemUpdateDialog {...itemUpdateDialogProps} />
      <DeleteItemConfirmDialog {...deleteItemConfirmDialogProps} />
    </Box>
  );
};
