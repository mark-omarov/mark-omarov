import Link from 'next/link';
import { Sigil } from '~/components/primitives-server';
import { PERSONAL } from '~/data/content';

const SITE_LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'Index' },
  { href: '/projects', label: 'Projects' },
  { href: '/certificates', label: 'Credentials' },
];

export function SiteFooter() {
  return (
    <footer className="mt-30 border-rule border-t px-0 pb-6 pt-10">
      <div className="grid-container grid grid-cols-12 gap-6 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
        <div className="col-span-4 max-md:col-span-2">
          <Sigil>MARK OMAROV · TOKYO</Sigil>
          <p className="text-graphite mt-4 max-w-[34ch] text-sm leading-normal">
            Hands-on engineer building a better web, line by line. Currently in
            Tokyo, open to senior, staff, and principal IC roles in 2026.
          </p>
        </div>
        <div className="col-span-3 max-md:col-span-1">
          <Sigil>Site</Sigil>
          <ul className="mt-3.5 grid list-none gap-2 p-0">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-quiet">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 max-md:col-span-1">
          <Sigil>Elsewhere</Sigil>
          <ul className="mt-3.5 grid list-none gap-2 p-0">
            <li>
              <Link
                className="link-quiet"
                href={PERSONAL.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </Link>
            </li>
            <li>
              <Link
                className="link-quiet"
                href={PERSONAL.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </Link>
            </li>
            <li>
              <Link className="link-quiet" href={`mailto:${PERSONAL.email}`}>
                {PERSONAL.email}
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-2 max-md:col-span-1">
          <Sigil>Build</Sigil>
          <div className="text-graphite mt-3.5 font-mono text-xs leading-7">
            <div>v3.0 · 2026</div>
            <div>Next 16 / React 19</div>
            <div>
              <Link
                className="link-quiet text-graphite text-xs"
                href="https://github.com/mark-omarov/mark-omarov"
                target="_blank"
                rel="noreferrer"
              >
                Open source ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-container mt-10 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
        <Sigil dim>© {new Date().getFullYear()} Mark Omarov</Sigil>
        <Sigil dim>Set in Inter Tight + JetBrains Mono</Sigil>
      </div>
    </footer>
  );
}
