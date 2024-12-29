import { create } from "zustand";

type State = {
  selectedFolderId: number | null;
};

type Actions = {
  setSelectedFolderId: (id: number | null) => void;
};

export const useFolderStore = create<State & Actions>()((set) => ({
  selectedFolderId: null,
  setSelectedFolderId: (id) => set(() => ({ selectedFolderId: id })),
}));
