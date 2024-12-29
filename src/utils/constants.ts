export const DisplayModes = {
  EDIT: "Edit",
  SPLIT: "Split",
  VIEW: "View",
} as const;

export type DisplayMode = (typeof DisplayModes)[keyof typeof DisplayModes];
