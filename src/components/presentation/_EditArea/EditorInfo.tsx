import { Box, Flex, Text, IconButton, Button } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { CustomInput } from "@/components/parts/CustomInput";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";

export type EditorInfoProps = {
  memoTitle: string;
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  availableTags: string[];
  onTitleChange: (newTitle: string) => void;
};

export const EditorInfo = ({
  memoTitle,
  tags,
  addTag,
  removeTag,
  availableTags,
  onTitleChange,
}: EditorInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(memoTitle);

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      addTag(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  const handleEditClick = () => {
    setEditingTitle(memoTitle);
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
    onTitleChange(editingTitle);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTitle(memoTitle);
  };

  return (
    <Box px="4" py="2">
      {/* ファイル名 */}
      {isEditing ? (
        <Flex alignItems="center" gap={2} mb={2}>
          <CustomInput
            type="text"
            value={editingTitle}
            onChange={handleTitleChange}
          />
          <Button onClick={handleSave} colorPalette="teal">
            Save
          </Button>
          <Button onClick={handleCancel} variant="subtle">
            Cancel
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center" gap={2} mb={2}>
          <Text fontSize="xl">{memoTitle}</Text>
          <IconButton onClick={handleEditClick} variant="ghost">
            <HiPencil />
          </IconButton>
        </Flex>
      )}
      {/* 編集可能なタグ一覧 */}
      <Flex gap={2} alignItems="center">
        {tags.map((tag, index) => (
          <Tag key={index} closable onClose={() => removeTag(tag)}>
            {tag}
          </Tag>
        ))}
        <CustomInput
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
