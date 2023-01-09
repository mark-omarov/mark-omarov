import { component$, Slot } from "@builder.io/qwik";

export const Avatar = component$(() => (
  <div class="relative w-40 h-40">
    <div class="w-full h-full rounded-full overflow-clip bd border border-border">
      <img class="pointer-events-none" src="/images/avatar.jpeg" alt="Avatar" />
    </div>
    <Slot />
  </div>
));
