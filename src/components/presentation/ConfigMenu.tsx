import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SegmentedControl } from "@/components/ui/segmented-control";

import { DeleteItemConfirmDialog } from "@/components/parts/DeleteItemConfirmDialog";
import { AppThemes } from "@/utils/constants";

export type ConfigMenuProps = {
  currentTheme: string;
  allTags: string[];
  onChangeTheme: (theme: string) => void;
  onClickRemoveTag: (tag: string) => void;
  deleteItemConfigDialogProps: React.ComponentProps<
    typeof DeleteItemConfirmDialog
  >;
};

export const ConfigMenu = ({
  currentTheme,
  allTags,
  onChangeTheme,
  onClickRemoveTag,
  deleteItemConfigDialogProps,
}: ConfigMenuProps) => {
  return (
    <>
      <DrawerRoot>
        <DrawerTrigger asChild>
          <Button onClick={(event) => event.currentTarget.blur()}>
            Config
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>設定</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box mb={4}>
              {/* テーマ切り替え */}
              <Text mb={2}>アプリテーマ切り替え</Text>
              <SegmentedControl
                onValueChange={(e) => onChangeTheme(e.value)}
                defaultValue={currentTheme}
                items={Object.values(AppThemes)}
              />
            </Box>
            {/* タグの修正 */}
            <Text mb={2}>タグ一覧</Text>
            <VStack
              alignItems="start"
              maxH="40"
              overflowY="scroll"
              bg="bg.subtle"
              p={2}
            >
              {allTags.map((tag, i) => (
                <Tag key={i} closable onClose={() => onClickRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
        <DrawerBackdrop />
      </DrawerRoot>
      <DeleteItemConfirmDialog {...deleteItemConfigDialogProps} />
    </>
  );
};
