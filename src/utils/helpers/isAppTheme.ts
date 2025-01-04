import { AppThemes, type AppTheme } from "@/utils/constants";
import { getObjectKeys } from "@/utils/helpers/getObjectKeys";

// AppThemeのValueかどうかを判定
export const isAppTheme = (value: any): value is AppTheme => {
  return getObjectKeys(AppThemes)
    .map((k) => AppThemes[k])
    .includes(value);
};
