import type { ReactNode } from "react";
import { Box, Button } from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomInput } from "@/components/parts/CustomInput";

type NewItemPopoverProps = {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onClickCreate: React.MouseEventHandler<HTMLButtonElement>;
  onKeyPressEnter: React.KeyboardEventHandler<HTMLInputElement>;
  children: ReactNode;
};

export const NewItemPopover = ({
  isPopoverOpen,
  setIsPopoverOpen,
  onClickCreate,
  onKeyPressEnter,
  inputValue,
  setInputValue,
  children,
}: NewItemPopoverProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <PopoverRoot
      open={isPopoverOpen}
      onOpenChange={(e) => setIsPopoverOpen(e.open)}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Box>
            <CustomInput
              mb={2}
              width="full"
              value={inputValue}
              onChange={handleOnChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onKeyPressEnter(e);
                }
              }}
            />
            <Button mt={4} onClick={onClickCreate}>
              Create
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
