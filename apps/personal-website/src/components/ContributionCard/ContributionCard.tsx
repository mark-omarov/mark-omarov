import { component$, Slot, type HTMLAttributes } from "@builder.io/qwik";
import { serializeClass } from "~/utils";

export const ContributionCard = component$((props: HTMLAttributes<Element>) => (
  <article
    {...props}
    class={"max-w-screen-md w-full rounded border border-border p-4 space-y-4".concat(
      serializeClass(props.class)
    )}
  >
    <h4 class="text-text font-bold">
      <Slot name="title" />
    </h4>
    <p class="text-text text-base">
      <Slot />
    </p>
  </article>
));
