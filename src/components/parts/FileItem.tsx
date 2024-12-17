import { Box, Text } from "@chakra-ui/react";

export type FileItemProps = {
  name: string;
  tags: string[];
  updatedAt: string;
};

export const FileItem = ({ name, tags, updatedAt }: FileItemProps) => {
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
        bg: "bg.emphasized",
      }}
    >
      <Text textStyle="md">{name}</Text>
      <Text textStyle="sm">{tags.map((v) => `#${v}`).join(" ")}</Text>
      <Text color="fg.subtle" textStyle="sm">
        {updatedAt}
      </Text>
    </Box>
  );
};
