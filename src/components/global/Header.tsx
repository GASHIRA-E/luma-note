import { Flex, HStack, Button } from "@chakra-ui/react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { ConfigMenu } from "@/components/parts/ConfigMenu";
import { SearchInput } from "@/components/parts/SearchInput";

export const Header = () => {
  return (
    <Flex
      justifyContent="space-between"
      px={4}
      py={2}
      borderBottomWidth={1}
      borderBottomColor="border"
    >
      <SearchInput />

      <HStack>
        <SegmentedControl
          defaultValue="Edit"
          items={["Edit", "Split", "View"]}
        />
        <ConfigMenu>
          <Button>Config</Button>
        </ConfigMenu>
      </HStack>
    </Flex>
  );
};
