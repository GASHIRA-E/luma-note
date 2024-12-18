import { Button, Text, VStack } from "@chakra-ui/react";
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

export type ConfigMenuProps = {
  children?: React.ReactElement;
};

export const ConfigMenu = ({ children }: ConfigMenuProps) => {
  return (
    <DrawerRoot>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Config Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Text textStyle="md">Tags</Text>
          <VStack alignItems="start" mt="4" maxH="40" overflowY="scroll" bg="bg.subtle" p={2}>
            {/* テストデータ */}
            {[...Array(20)].map((_, i) => (
              <Tag key={i} closable>
                Tag{i}
              </Tag>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerCloseTrigger asChild>
          <Button>Close</Button>
        </DrawerCloseTrigger>
        <DrawerFooter>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
      <DrawerBackdrop />
    </DrawerRoot>
  );
};
