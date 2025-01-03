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

export const {{ inputs.domainName | constant }}_KEYS = {
  EXAMPLE_GET: "example_get_command",
  EXAMPLE_UPDATE: "example_update_command"
} as const;

// コマンド名の一覧
export type {{ inputs.domainName | pascal }}Keys = (typeof {{ inputs.domainName | constant }}_KEYS)[keyof typeof {{ inputs.domainName | constant }}_KEYS];

// コマンドの型定義をまとめる
export type {{ inputs.domainName | pascal }}Invokes = ExampleGetCommand | ExampleUpdateCommand;

type ExampleGetCommand = InvokeBase<
  {{ inputs.domainName | pascal }}Keys,
  typeof {{ inputs.domainName | constant }}_KEYS.EXAMPLE_GET,
  undefined,
  {
    id: number;
    name: string;
  }
>;

export const exampleGetCommandQuery = () => {
  return useQuery({
    queryKey: [{{ inputs.domainName | constant }}_KEYS.EXAMPLE_GET],
    queryFn: () => customInvoke({{ inputs.domainName | constant }}_KEYS.EXAMPLE_GET, undefined),
  });
};

type ExampleUpdateCommand = InvokeBase<
  {{ inputs.domainName | pascal }}Keys,
  typeof {{ inputs.domainName | constant }}_KEYS.EXAMPLE_UPDATE,
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
    mutationFn: () => customInvoke({{ inputs.domainName | constant }}_KEYS.EXAMPLE_UPDATE, props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [{{ inputs.domainName | constant }}_KEYS.EXAMPLE_GET] });
    },
  });
};
```