import { useEffect, useState } from "react";
import { Portal } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";
import { CustomInput } from "@/components/parts/CustomInput";

type ItemUpdateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSave: () => void;
};

export const ItemUpdateDialog = ({
  isOpen,
  onClose,
  inputValue,
  setInputValue,
  onSave,
}: ItemUpdateDialogProps) => {
  const [currentOpen, setCurrentOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setCurrentOpen(false);
      return;
    }
    (document.activeElement as HTMLElement)?.blur();
    // Hack: フォーカスが移動してからダイアログを開き、Menuからフォーカスを外すため
    setTimeout(() => {
      setCurrentOpen(isOpen);
    }, 10);
  }, [isOpen]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <DialogRoot
      open={currentOpen}
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
    >
      <Portal>
        <DialogContent>
          <DialogBody>
            <CustomInput mb={4} value={inputValue} onChange={handleOnChange} />
          </DialogBody>
          <DialogFooter>
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button colorPalette="teal" onClick={onSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
