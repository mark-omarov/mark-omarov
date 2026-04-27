import Link from 'next/link';
import { Section } from '~/components/section';
import { Sigil } from '~/components/primitives-server';
import { PROJECTS } from '~/data/content';

export function FeaturedProjects() {
  const featured = PROJECTS.slice(0, 4);

  return (
    <Section
      eyebrow="04 / Selected Projects"
      title="What I build outside the day job."
    >
      <p className="text-graphite -mt-6 mb-8 max-w-[54ch] text-[15px]">
        Open-source developer tools, infrastructure work, and shipped product.
        The list is intentionally short: recent, public, and worth talking
        about.
      </p>
      <div className="bg-rule grid grid-cols-2 gap-px max-md:grid-cols-1">
        {featured.map((p) => {
          const isHomelab = p.id === '01';
          const href = isHomelab ? '/projects' : (p.href ?? '/projects');
          const external = !isHomelab && Boolean(p.href);

          return (
            <Link
              key={p.id}
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="project-tile bg-ink hover:bg-paper block p-7 text-left text-inherit no-underline"
            >
              <div className="flex items-center justify-between">
                <Sigil>
                  {p.id} / {p.year}
                </Sigil>
                <Sigil dim>{p.tag}</Sigil>
              </div>
              <h3 className="font-display mb-2.5 mt-5 text-[26px] font-medium leading-[1.15] tracking-[-0.015em]">
                {p.title}
              </h3>
              <p className="text-graphite m-0 max-w-[52ch] text-sm leading-[1.55]">
                {p.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {p.stack.slice(0, 6).map((s) => (
                  <span key={s} className="chip-mono">
                    {s}
                  </span>
                ))}
                {p.stack.length > 6 && (
                  <span className="chip-mono">+{p.stack.length - 6}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        <Link href="/projects" className="link-arrow">
          All projects, indexed <span className="arrow">→</span>
        </Link>
      </div>
    </Section>
  );
}
