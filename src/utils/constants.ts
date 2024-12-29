export const DisplayModes = {
  EDIT: "Edit",
  SPLIT: "Split",
  VIEW: "View",
} as const;

export type DisplayMode = (typeof DisplayModes)[keyof typeof DisplayModes];

// アプリのテーマ一覧
export const AppThemes = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type AppTheme = (typeof AppThemes)[keyof typeof AppThemes];
