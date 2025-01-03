import { useEffect, useState } from "react";
import { Portal, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  NativeSelectRoot,
  NativeSelectField,
} from "@/components/ui/native-select";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";

type MemoChangeFolderDialogProps = {
  currentFolderId: number | null;
  folders: {
    id: number | null;
    name: string;
  }[];
  folderId: number | null;
  setFolderId: (folderId: number | null) => void;
  isOpen: boolean;
  onClose: () => void;
  onClickSave: () => void;
};

export const MemoChangeFolderDialog = ({
  folders,
  isOpen,
  folderId,
  setFolderId,
  onClose,
  onClickSave,
}: MemoChangeFolderDialogProps) => {
  const [currentOpen, setCurrentOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentOpen(false);
      return;
    }
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      setCurrentOpen(isOpen);
    }, 50);
  }, [isOpen]);

  const handleChangeFolder: React.FormEventHandler<HTMLSelectElement> = (v) => {
    const selectedValue = v.currentTarget.value;
    if (!selectedValue) {
      setFolderId(null);
      return;
    }
    setFolderId(Number(selectedValue));
  };

  return (
    <DialogRoot
      open={currentOpen}
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
      unmountOnExit
    >
      <Portal>
        <DialogContent>
          <DialogBody>
            <Text mb={2}>フォルダーを変更</Text>
            <NativeSelectRoot>
              <NativeSelectField
                onChange={handleChangeFolder}
                value={folderId || ""}
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id || ""}>
                    {folder.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </DialogBody>
          <DialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClickSave} color="fg.primary">
              Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
