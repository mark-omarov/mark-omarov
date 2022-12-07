import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <>Root</>;
});

export const head: DocumentHead = {
  title: "App",
  meta: [
    {
      name: "description",
      content: "App",
    },
  ],
};
