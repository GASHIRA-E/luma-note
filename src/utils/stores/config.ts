import { create } from "zustand";
import { AppThemes, type AppTheme } from "@/utils/constants";

type fontSize = 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

type State = {
  /** テーマ */
  theme: AppTheme;
  /** フォントサイズ */
  fontSize: fontSize;
  /** 自動保存 */
  autoSave: boolean;
};

type Actions = {
  setTheme: (theme: AppTheme) => void;
  setFontSize: (fontSize: fontSize) => void;
  setAutoSave: (autoSave: boolean) => void;
};

export const useConfigStore = create<State & Actions>()((set) => ({
  theme: AppThemes.SYSTEM,
  fontSize: 16,
  autoSave: false,
  setTheme: (theme) => set(() => ({ theme })),
  setFontSize: (fontSize) => set(() => ({ fontSize })),
  setAutoSave: (autoSave) => set(() => ({ autoSave })),
}));
