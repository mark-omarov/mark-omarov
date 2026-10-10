import { LINKS } from '~/data/site';
import { VimHint } from './vim-keys';

export function SiteFooter() {
  return (
    <footer className="page text-muted mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-10 pt-6 text-xs">
      <p>
        © {new Date().getFullYear()} Mark Omarov ·{' '}
        <a href="https://github.com/mark-omarov/mark-omarov" className="link">
          source
        </a>
      </p>
      <ul className="flex items-center gap-4">
        <li>
          <VimHint />
        </li>
        {LINKS.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="hover:text-fg">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
