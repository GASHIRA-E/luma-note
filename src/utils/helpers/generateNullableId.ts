import { NullableId } from "@/types/invokeGenerate";

export const generateNullableId = <T>(value: T | null): NullableId<T> => {
  if (value === null) {
    return { type: "Null" };
  }
  return { type: "Value", content: value };
};
