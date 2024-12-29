import { create } from "zustand";

type Theme = "light" | "dark";
type fontSize = 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40;

type State = {
  /** テーマ */
  theme: Theme;
  /** フォントサイズ */
  fontSize: fontSize;
  /** 自動保存 */
  autoSave: boolean;
};

type Actions = {
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: fontSize) => void;
  setAutoSave: (autoSave: boolean) => void;
};

export const useConfigStore = create<State & Actions>()((set) => ({
  theme: "light",
  fontSize: 16,
  autoSave: false,
  setTheme: (theme) => set(() => ({ theme })),
  setFontSize: (fontSize) => set(() => ({ fontSize })),
  setAutoSave: (autoSave) => set(() => ({ autoSave })),
}));
