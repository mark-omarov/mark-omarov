import Link from 'next/link';
import { Section } from '~/components/section';
import { Sigil } from '~/components/primitives-server';
import { PERSONAL } from '~/data/content';

interface ContactRowProps {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactRow({ label, value, href, external = true }: ContactRowProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="contact-row bg-ink text-bone hover:bg-paper flex items-center justify-between px-[22px] py-5 no-underline"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3.5">
        <Sigil dim className="flex-none">
          {label}
        </Sigil>
        <span className="min-w-0 break-words text-base [overflow-wrap:anywhere]">
          {value}
        </span>
      </span>
      <span className="text-graphite font-mono">↗</span>
    </Link>
  );
}

export function ContactSection() {
  return (
    <Section id="contact" eyebrow="05 / Contact" title="Open file.">
      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        <div>
          <p className="text-bone m-0 max-w-[40ch] text-lg leading-[1.55]">
            Open to Senior IC and Tech Lead roles.
            <br />
            Tokyo onsite/hybrid or global remote.
          </p>
          <p className="text-graphite mt-4 max-w-[40ch] text-sm leading-[1.55]">
            I read every cold message. The fastest path is email; LinkedIn is
            fine too. Outside day jobs I maintain open-source dev tools and run
            a homelab. That work feeds back: faster prototyping, sharper
            opinions on DX, less hesitation around touching infra.
          </p>
        </div>
        <div className="bg-rule grid gap-px">
          <ContactRow
            label="EMAIL"
            value={PERSONAL.email}
            href={`mailto:${PERSONAL.email}`}
            external={false}
          />
          <ContactRow
            label="GITHUB"
            value="@mark-omarov"
            href={PERSONAL.github}
          />
          <ContactRow
            label="LINKEDIN"
            value="/in/mark-omarov"
            href={PERSONAL.linkedin}
          />
        </div>
      </div>
    </Section>
  );
}
