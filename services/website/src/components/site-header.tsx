import Link from 'next/link';

const NAV = [
  { href: '/blog', label: 'blog' },
  { href: '/learned', label: 'learned' },
];

export function SiteHeader() {
  return (
    <header className="page flex items-center justify-between py-4">
      <Link
        href="/"
        className="font-pixel text-fg hover:text-green text-lg leading-none"
      >
        omarov<span className="text-muted">.dev</span>
      </Link>
      <nav aria-label="main" className="flex gap-5 text-sm">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-soft hover:text-blue"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
