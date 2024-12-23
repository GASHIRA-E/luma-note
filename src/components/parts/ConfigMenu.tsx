import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SegmentedControl } from "@/components/ui/segmented-control";

export type ConfigMenuProps = {
  children?: React.ReactElement;
};

export const ConfigMenu = ({ children }: ConfigMenuProps) => {
  const handleValueThemeChange = (themeValue: string) => {
    alert(themeValue);
  };

  return (
    <DrawerRoot>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Config Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Box mb={4}>
            {/* テーマ切り替え */}
            <Text mb={2}>Theme</Text>
            <SegmentedControl
              onValueChange={(e) => handleValueThemeChange(e.value)}
              defaultValue="System"
              items={["Light", "Dark", "System"]}
            />
          </Box>
          {/* タグの修正 */}
          <Text mb={2}>Tags</Text>
          <VStack
            alignItems="start"
            maxH="40"
            overflowY="scroll"
            bg="bg.subtle"
            p={2}
          >
            {/* テストデータ */}
            {[...Array(20)].map((_, i) => (
              <Tag key={i} closable>
                Tag{i}
              </Tag>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerCloseTrigger />
        <DrawerFooter>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
      <DrawerBackdrop />
    </DrawerRoot>
  );
};
