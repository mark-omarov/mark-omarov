export type ClassList =
  | string
  | undefined
  | null
  | Record<string, boolean | string | number | null | undefined>
  | ClassList[];
