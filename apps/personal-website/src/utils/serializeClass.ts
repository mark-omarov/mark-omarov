import { ClassList } from "~/types/jsxAttributes";
import { isArray, isString } from "./types";
import { Signal } from "@builder.io/qwik";

export const serializeClass = (obj: ClassList | Signal<ClassList>): string => {
  if (!obj) return "";
  if (isString(obj)) return obj.trim();

  if (isArray(obj))
    return obj.reduce((result: string, o) => {
      const classList = serializeClass(o);
      return classList
        ? result
          ? `${result} ${classList}`
          : classList
        : result;
    }, "");

  return Object.entries(obj.value ? obj.value : obj).reduce(
    (result, [key, value]) =>
      value ? (result ? `${result} ${key.trim()}` : key.trim()) : result,
    ""
  );
};
