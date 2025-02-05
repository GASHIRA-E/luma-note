import { useEffect, useState } from "react";
import { Portal, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";

type DeleteItemConfirmDialogProps = {
  targetItemName: string;
  removeRelationMemo?: boolean;
  setRemoveRelationMemo?: (value: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteItemConfirmDialog = ({
  targetItemName,
  removeRelationMemo,
  setRemoveRelationMemo,
  isOpen,
  onClose,
  onDelete,
}: DeleteItemConfirmDialogProps) => {
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
            <Text
              mb={2}
            >{`"${targetItemName}"を削除してもよろしいですか？`}</Text>
            {removeRelationMemo !== undefined && (
              <Checkbox
                checked={removeRelationMemo}
                onCheckedChange={(d) =>
                  setRemoveRelationMemo && setRemoveRelationMemo(!!d.checked)
                }
              >
                関連するメモも削除する
              </Checkbox>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onDelete} colorPalette="red">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
