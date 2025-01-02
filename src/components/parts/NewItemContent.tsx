import { Box, Button, Input } from "@chakra-ui/react";

type NewItemContentProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  onClickCreate: React.MouseEventHandler<HTMLButtonElement>;
};

export const NewItemContent = ({
  onClickCreate,
  inputValue,
  setInputValue,
}: NewItemContentProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <Box>
      <Input mb={2} width="full" value={inputValue} onChange={handleOnChange} />
      <Button mt={4} onClick={onClickCreate}>
        Create
      </Button>
    </Box>
  );
};
