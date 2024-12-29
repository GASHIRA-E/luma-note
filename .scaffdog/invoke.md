---
name: 'invoke'
root: 'src/utils/invoke'
output: '.'
ignore: []
questions:
  domainName: '作成するドメイン名を入力'
---

# `{{ inputs.domainName | pascal }}.ts`

```ts
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { InvokeBase, customInvoke } from "./_base";

// コマンド名の一覧
export type {{ inputs.domainName | pascal }}Keys = "example_get_command" | "example_update_command";

// コマンドの型定義をまとめる
export type {{ inputs.domainName | pascal }}Invokes = ExampleGetCommand | ExampleUpdateCommand;

type ExampleGetCommand = InvokeBase<
  {{ inputs.domainName | pascal }}Keys,
  "example_get_command",
  undefined,
  {
    id: number;
    name: string;
  }
>;

export const exampleGetCommandQuery = () => {
  return useQuery({
    queryKey: ["example_get_command"],
    queryFn: () => customInvoke("example_get_command", undefined),
  });
};

type ExampleUpdateCommand = InvokeBase<
  {{ inputs.domainName | pascal }}Keys,
  "example_update_command",
  {
    id: number;
    name: string;
  },
  null
>;

export const exampleUpdateCommandQuery = (
  props: ExampleUpdateCommand["props"],
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => customInvoke("example_update_command", props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example_get_command"] });
    },
  });
};
```