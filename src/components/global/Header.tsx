import { Input, Flex } from "@chakra-ui/react";

import { InputGroup } from "@/components/ui/input-group";
import { SegmentedControl } from "@/components/ui/segmented-control";

export const Header = () => {
  return (
    <Flex
      justifyContent="space-between"
      px={4}
      py={2}
      borderBottomWidth={1}
      borderBottomColor="border"
    >
      <Flex>
        <InputGroup>
          <Input placeholder="search text" w={300} />
        </InputGroup>
      </Flex>
      <SegmentedControl defaultValue="Edit" items={["Edit", "Split", "View"]} />
    </Flex>
  );
};
