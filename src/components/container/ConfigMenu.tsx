import { useState } from "react";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useColorMode } from "@/components/ui/color-mode";

import { ConfigMenu } from "@/components/presentation/ConfigMenu";

import { getTagsQuery, deleteTagMutation } from "@/utils/invoke/Tags";
import { useConfigStore } from "@/utils/stores/config";
import { AppThemes, type AppTheme } from "@/utils/constants";
import { getObjectKeys } from "@/utils/helpers/getObjectKeys";

// AppThemeのValueかどうかを判定
const isAppTheme = (value: any): value is AppTheme => {
  return getObjectKeys(AppThemes)
    .map((k) => AppThemes[k])
    .includes(value);
};

export const ConfigMenuContainer = () => {
  const currentTheme = useConfigStore((state) => state.theme);
  const setTheme = useConfigStore((state) => state.setTheme);

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
    if (isAppTheme(themeValue)) {
      setTheme(themeValue);
    }
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
