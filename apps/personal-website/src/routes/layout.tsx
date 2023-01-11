import { component$, Slot } from "@builder.io/qwik";
import {
  IconButton,
  TwitterIcon,
  GitHubIcon,
  LinkedinIcon,
  MailIcon,
} from "~/components";

export default component$(() => {
  return (
    <div class="min-h-screen bg-primary">
      <div class="max-w-3xl mx-auto space-y-12">
        <div class="px-4">
          <Slot />
        </div>
        <div class="md:px-4">
          <div class="max-md:p-4 md:py-4 border-border border-t flex justify-between items-center">
            <div class="flex space-x-2">
              <a
                href="https://twitter.com/mark_omarov"
                target="_blank"
                aria-label="Mark Omarov Twitter profile"
              >
                <IconButton icon={TwitterIcon} />
              </a>
              <a
                href="https://github.com/mark-omarov"
                target="_blank"
                aria-label="Mark Omarov GitHub profile"
              >
                <IconButton icon={GitHubIcon} />
              </a>
              <a
                href="https://www.linkedin.com/in/mark-omarov/"
                target="_blank"
                aria-label="Mark Omarov LinkedIn profile"
              >
                <IconButton icon={LinkedinIcon} />
              </a>
            </div>
            <div>
              <a
                href="mailto:reply.qml41@slmail.me"
                className="w-40 bg-secondary rounded border border-border p-2
                           flex justify-center items-center cursor-pointer
                           hover:border-accent space-x-2 group"
                aria-label="Contact me"
              >
                <MailIcon class="fill-text group-hover:fill-accent h-6 w-6" />
                <span className="text-text text-lg font-bold group-hover:text-accent">
                  Contact Me
                </span>
              </a>
            </div>
            {/* It's not ready, yet */}
            {/*<IconBtn icon={InfoSvg} />*/}
          </div>
        </div>
      </div>
    </div>
  );
});
