import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";

export type EditorInfoProps = {
  memoTitle: string;
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  availableTags: string[];
};

export const EditorInfo = ({
  memoTitle,
  tags,
  addTag,
  removeTag,
  availableTags,
}: EditorInfoProps) => {
  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      addTag(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  return (
    <Box px="4" py="2">
      {/* ファイル名 */}
      <Text fontSize="xl">{memoTitle}</Text>
      {/* 編集可能なタグ一覧 */}
      <Flex gap={2} alignItems="center">
        {tags.map((tag, index) => (
          <Tag key={index} closable onClose={() => removeTag(tag)}>
            {tag}
          </Tag>
        ))}
        <Input
          placeholder="タグを追加"
          maxLength={12}
          width="60"
          list="tags"
          onKeyPress={handleKeyPress}
        />
        <datalist id="tags">
          {availableTags.map((tag, index) => (
            <option key={index} value={tag} />
          ))}
        </datalist>
      </Flex>
    </Box>
  );
};
