import { useMemo, useEffect } from "react";
import { useColorMode } from "@/components/ui/color-mode";

import { ConfigMenu } from "@/components/presentation/ConfigMenu";

import { getTagsQuery } from "@/utils/invoke/Tags";
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

  const { data } = getTagsQuery();
  const allTags = useMemo<string[]>(() => {
    if (!data) {
      return [];
    }
    return data.tags.flatMap((tag) => tag.name);
  }, [data]);

  const handleValueThemeChange = (themeValue: string) => {
    if (isAppTheme(themeValue)) {
      setTheme(themeValue);
    }
  };

  const handleRemoveTag = (tag: string) => {
    // 未実装
    alert("remove tag: " + tag);
  };

  return (
    <ConfigMenu
      currentTheme={currentTheme}
      allTags={allTags}
      onChangeTheme={handleValueThemeChange}
      onClickRemoveTag={handleRemoveTag}
    />
  );
};
