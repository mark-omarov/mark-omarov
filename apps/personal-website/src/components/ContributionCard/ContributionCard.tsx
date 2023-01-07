import { component$, Slot } from "@builder.io/qwik";

export const ContributionCard = component$(() => (
  <article class="max-w-md w-full rounded border border-border p-4 space-y-4">
    <h4 class="text-text font-bold">
      <Slot name="title" />
    </h4>
    <p class="text-text text-base">
      <Slot />
    </p>
  </article>
));
