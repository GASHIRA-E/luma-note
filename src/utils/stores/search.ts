import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Result = {
  id: number;
  title: string;
  folderId: number;
  updateAt: string;
};

type State = {
  hasSearched: boolean;
  result: Result[];
};

type Actions = {
  setSearchedResult: (result: Result[]) => void;
  clearSearchedResult: () => void;
  setHasSearched: (hasSearched: boolean) => void;
};

export const useSearchStore = create<State & Actions>()(
  devtools((set) => ({
    hasSearched: false,
    result: [],
    setSearchedResult: (result) => set({ result, hasSearched: true }),
    clearSearchedResult: () => set({ result: [], hasSearched: false }),
    setHasSearched: (hasSearched) => set({ hasSearched }),
  }))
);
