import { component$, Slot, HTMLAttributes } from "@builder.io/qwik";
import { serializeClass } from "~/utils/serializeClass";
import { LinkExternalIcon } from "~/components";

type LinkProps = HTMLAttributes<Element> & {
  to: string;
  external?: boolean;
};

export const Link = component$(({ to, external, ...rest }: LinkProps) => (
  <a
    {...rest}
    href={to}
    target={external ? "_blank" : "_self"}
    class={"text-accent hover:underline flex items-center".concat(
      serializeClass(rest.class)
    )}
  >
    <Slot />
    {external && <LinkExternalIcon class="fill-text inline" />}
  </a>
));
