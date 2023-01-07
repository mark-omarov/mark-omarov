import { component$, type FunctionComponent } from "@builder.io/qwik";

export const IconButton = component$(
  ({ icon: Icon }: { icon: FunctionComponent }) => (
    <div
      class="w-10 h-10 bg-secondary rounded-full border border-border flex justify-center items-center
           hover:border-accent transition-colors ease-in-out duration-500 group"
    >
      <Icon class="fill-text w-6 h-6 group-hover:fill-accent transition-colors ease-in-out duration-500" />
    </div>
  )
);
