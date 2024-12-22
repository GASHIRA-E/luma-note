import { Box, Text, Float, Circle } from "@chakra-ui/react";

export type FolderProps = {
  name: string;
  selected?: boolean;
  memoCounts?: number;
  onClick: () => void;
};

export const FolderItem = ({
  name,
  selected,
  memoCounts,
  onClick,
}: FolderProps) => {
  return (
    <Box
      position="relative"
      borderWidth={1}
      borderColor="border"
      bg={selected ? "bg.emphasized" : "bg.subtle"}
      p={2}
      borderRadius={2}
      cursor="pointer"
      transition="background-color 0.3s"
      _hover={{
        bg: "bg.emphasized",
      }}
      onClick={selected ? undefined : onClick}
    >
      {memoCounts !== undefined ? (
        <Float placement="top-end">
          <Circle size={5} bg="teal.emphasized">
            {memoCounts}
          </Circle>
        </Float>
      ) : null}
      <Text textStyle="md">{name}</Text>
    </Box>
  );
};
