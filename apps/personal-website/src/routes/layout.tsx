import { component$, Slot } from "@builder.io/qwik";
import {
  IconButton,
  TwitterIcon,
  GitHubIcon,
  LinkedinIcon,
} from "~/components";

export default component$(() => {
  return (
    <div class="min-h-screen bg-primary">
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="px-4">
          <Slot />
        </div>
        <div class="p-4 border-border border-t flex justify-between items-center">
          <div class="flex space-x-2">
            <a href="https://twitter.com/mark_omarov" target="_blank">
              <IconButton icon={TwitterIcon} />
            </a>
            <a href="https://github.com/mark-omarov" target="_blank">
              <IconButton icon={GitHubIcon} />
            </a>
            <a href="https://www.linkedin.com/in/mark-omarov/" target="_blank">
              <IconButton icon={LinkedinIcon} />
            </a>
          </div>
          {/* It's not ready, yet */}
          {/*<IconBtn icon={InfoSvg} />*/}
        </div>
      </div>
    </div>
  );
});
