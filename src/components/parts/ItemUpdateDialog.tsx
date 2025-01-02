import { useEffect } from "react";
import { Input, Portal } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/components/ui/dialog";

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
  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, [isOpen]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <DialogRoot
      open={isOpen}
      onEscapeKeyDown={onClose}
      onPointerDownOutside={onClose}
    >
      <Portal>
        <DialogContent>
          <DialogBody>
            <Input mb={4} value={inputValue} onChange={handleOnChange} />
          </DialogBody>
          <DialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
