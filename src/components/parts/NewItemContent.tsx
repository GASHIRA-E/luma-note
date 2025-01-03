import { Box, Button, Input } from "@chakra-ui/react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";

type NewItemPopoverProps = {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onClickCreate: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export const NewItemPopover = ({
  isPopoverOpen,
  setIsPopoverOpen,
  onClickCreate,
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
            <Input
              mb={2}
              width="full"
              value={inputValue}
              onChange={handleOnChange}
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
