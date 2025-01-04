import { useState } from "react";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useColorMode } from "@/components/ui/color-mode";

import { ConfigMenu } from "@/components/presentation/ConfigMenu";

import { getTagsQuery, deleteTagMutation } from "@/utils/invoke/Tags";
import { useAppSettingContext } from "@/components/context/AppSettingContext";

export const ConfigMenuContainer = () => {
  const { theme: currentTheme, setTheme } = useAppSettingContext();

  // アプリテーマの変更
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode(currentTheme);
  }, [currentTheme, setColorMode]);

  const queryClient = useQueryClient();
  const { data } = getTagsQuery();
  const { mutateAsync: deleteTagMutateAsync } = deleteTagMutation(queryClient);
  const allTags = useMemo<string[]>(() => {
    if (!data) {
      return [];
    }
    return data.flatMap((tag) => tag.name);
  }, [data]);

  const handleValueThemeChange = (themeValue: string) => {
    setTheme(themeValue);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [removeSelectedTag, setRemoveSelectedTag] = useState<string | null>(
    null
  );

  const handleRemoveTag = (tag: string) => {
    setRemoveSelectedTag(tag);
    setIsDialogOpen(true);
  };

  const handleDeleteTag = () => {
    const selectedTagId =
      data?.find((tag) => tag.name === removeSelectedTag)?.id || 0;
    if (selectedTagId) {
      deleteTagMutateAsync({
        tagId: selectedTagId,
      })
        .then(() => {
          setRemoveSelectedTag(null);
        })
        .finally(() => {
          setIsDialogOpen(false);
        });
    }
  };

  return (
    <ConfigMenu
      currentTheme={currentTheme}
      allTags={allTags}
      onChangeTheme={handleValueThemeChange}
      onClickRemoveTag={handleRemoveTag}
      deleteItemConfigDialogProps={{
        isOpen: isDialogOpen,
        onClose: () => setIsDialogOpen(false),
        onDelete: handleDeleteTag,
        targetItemName: removeSelectedTag || "",
      }}
    />
  );
};
