import { Box, Text } from "@chakra-ui/react";

export type FolderProps = {
  name: string;
  selected: boolean;
};

export const FolderItem = ({ name, selected }: FolderProps) => {
  return (
    <Box
      borderWidth={1}
      borderColor="border"
      bg="bg.subtle"
      p={2}
      borderRadius={2}
      cursor="pointer"
      transition="background-color 0.3s"
      _hover={{
        bg: "bg.emphasized"
      }}
    >
      <Text textStyle="md">{name}</Text>
    </Box>
  );
};
