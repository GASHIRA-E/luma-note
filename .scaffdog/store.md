---
name: 'store'
root: 'src/utils/stores'
output: '.'
ignore: []
questions:
  storeName: '作成するstore名を入力'
---

# `{{ inputs.storeName | camel }}.ts`

```ts
import { create } from "zustand";

type State = {
  count: number;
};

type Actions = {
  increment: () => void;
  decrement: () => void;
};

export const use{{ inputs.storeName | pascal }}Store = create<State & Actions>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

```