import type React from "react";
import { Flex, HStack, Button } from "@chakra-ui/react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { ConfigMenu } from "@/components/parts/ConfigMenu";
import { SearchInput } from "@/components/parts/SearchInput";

import { getObjectKeys } from "@/utils/helpers/getObjectKeys";
import { DisplayModes, type DisplayMode } from "@/utils/constants";

type HeaderProps = {
  editorDisplayModeValue: DisplayMode;
  setEditorDisplayMode: (mode: DisplayMode) => void;
};

const SegmentItems = getObjectKeys(DisplayModes).map((k) => DisplayModes[k]);

const isDisplayMode = (value: any): value is DisplayMode => {
  return SegmentItems.includes(value);
};

export const Header = ({
  editorDisplayModeValue,
  setEditorDisplayMode,
}: HeaderProps) => {
  const handleValueChange: React.ComponentProps<
    typeof SegmentedControl
  >["onValueChange"] = (e) => {
    const value = e.value;
    if (isDisplayMode(value)) {
      setEditorDisplayMode(value);
    }
  };

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
          value={editorDisplayModeValue}
          onValueChange={handleValueChange}
          items={SegmentItems}
        />
        <ConfigMenu>
          <Button>Config</Button>
        </ConfigMenu>
      </HStack>
    </Flex>
  );
};
