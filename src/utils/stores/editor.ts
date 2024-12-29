import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type DisplayMode } from "@/utils/constants";

type State = {
  displayMode: DisplayMode;
  selectedMemoId: number | null;
};

type Actions = {
  setDisplayMode: (mode: DisplayMode) => void;
  // 選択中のメモのIDを設定する nullの場合は何も選択されていない
  setSelectedMemoId: (id: number | null) => void;
};

export const useEditorStore = create<State & Actions>()(
  devtools(
    (set) => ({
      displayMode: "Split",
      selectedMemoId: null,
      setDisplayMode: (mode) => set(() => ({ displayMode: mode })),
      setSelectedMemoId: (id) => set(() => ({ selectedMemoId: id })),
    }),
    {
      name: "editor",
    }
  )
);
