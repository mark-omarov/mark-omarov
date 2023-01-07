import { component$, Slot } from "@builder.io/qwik";

export const Avatar = component$(() => (
  <div class="relative w-40">
    <div class="rounded-full overflow-clip bd border border-border">
      <img class="pointer-events-none" src="/images/avatar.jpeg" alt="Avatar" />
    </div>
    <Slot />
  </div>
));
