import { create } from "zustand";
import { type DisplayMode } from '@/utils/constants';

type State = {
  displayMode: DisplayMode;
};

type Actions = {
  setDisplayMode: (mode: DisplayMode) => void;
};

export const useEditorStore = create<State & Actions>()((set) => ({
  displayMode: "Split",
  setDisplayMode: (mode) => set(() => ({ displayMode: mode })),
}));
