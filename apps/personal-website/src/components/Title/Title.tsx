import { component$, HTMLAttributes, Slot } from "@builder.io/qwik";
import { serializeClass } from "~/utils/serializeClass";

export const Title = component$(({ ...rest }: HTMLAttributes<Element>) => {
  return (
    <h3
      {...rest}
      class={"text-text text-lg font-bold space-x-2 flex items-center".concat(
        serializeClass(rest.class)
      )}
    >
      <div class="w-5 h-5 flex justify-center items-center">
        <Slot name="icon" />
      </div>
      <span>
        <Slot />
      </span>
    </h3>
  );
});
