import type { Metadata } from 'next';
import Link from 'next/link';
import { Sigil } from '~/components/primitives-server';
import { RevealObserver } from '~/components/primitives-client';
import { StackDiagram } from '~/components/stack-diagram';
import { HOMELAB_LAYERS, PROJECTS } from '~/data/content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Open-source developer tools, infrastructure work, and shipped product. Marshant, gh-contribution-mate, uapi-json, personal homelab.',
  alternates: { canonical: '/projects' },
};

interface MetaPairProps {
  label: string;
  value: string;
  accent?: boolean;
}

function MetaPair({ label, value, accent }: MetaPairProps) {
  return (
    <div>
      <Sigil dim>{label}</Sigil>
      <div
        className={`mt-1.5 font-mono text-[13px] tracking-[0.04em] ${accent ? 'text-signal' : 'text-bone'}`}
      >
        {value}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const feature = PROJECTS.find((p) => p.feature) ?? PROJECTS[0];
  if (!feature) throw new Error('No projects defined');

  return (
    <>
      <RevealObserver />

      <section className="pb-12 pt-16">
        <div className="grid-container">
          <div className="grid grid-cols-12 items-end gap-6 max-md:grid-cols-1 max-md:gap-4">
            <div className="col-span-8 max-md:col-span-1">
              <Sigil>PROJECTS / Index</Sigil>
              <h1 className="font-display text-bone m-0 mt-[18px] text-[clamp(56px,7vw,104px)] font-medium leading-[0.96] tracking-[-0.03em]">
                {PROJECTS.length} entries.
                <br />
                <span className="text-graphite">
                  Recent, public, worth talking about.
                </span>
              </h1>
            </div>
            <div className="col-span-4 max-md:col-span-1">
              <p className="text-graphite m-0 max-w-[36ch] text-sm leading-[1.55]">
                Open-source developer tools, infrastructure work, and shipped
                product. The list is intentionally short.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal="true" className="pb-24">
        <div className="grid-container">
          <div className="border-rule grid grid-cols-[5fr_7fr] border max-lg:grid-cols-1">
            <div className="border-rule border-r p-10 max-lg:border-b max-lg:border-r-0 max-md:p-8">
              <div className="flex items-center gap-3">
                <Sigil accent>FEATURED · {feature.id}</Sigil>
                <span className="bg-rule h-px w-6" />
                <Sigil dim>
                  {feature.year} · {feature.tag}
                </Sigil>
              </div>
              <h2 className="font-display text-bone m-0 mt-7 text-[clamp(36px,3.8vw,60px)] font-medium leading-none tracking-[-0.028em]">
                {feature.title}
              </h2>
              <p className="text-bone m-0 mt-[18px] max-w-[40ch] text-[17px] leading-[1.5]">
                {feature.summary}
              </p>
              {feature.longSummary && (
                <p className="text-graphite m-0 mt-3.5 max-w-[44ch] text-sm leading-[1.55]">
                  {feature.longSummary}
                </p>
              )}

              <div className="border-rule mt-9 grid grid-cols-2 gap-5 border-t pt-6">
                <MetaPair label="Role" value={feature.role} />
                <MetaPair label="Status" value={feature.status} accent />
                <MetaPair label="Year" value={feature.year} />
                <MetaPair label="Type" value={feature.tag} />
              </div>
            </div>

            <StackDiagram
              layers={HOMELAB_LAYERS}
              totalCount={feature.stack.length}
            />
          </div>
        </div>
      </section>

      <section data-reveal="true" className="pb-6">
        <div className="grid-container border-rule flex items-center justify-between border-b pb-4">
          <Sigil>The Index</Sigil>
          <Sigil dim>{PROJECTS.length} entries · sorted by year</Sigil>
        </div>
      </section>

      <section data-reveal="true" className="pb-24">
        <div className="grid-container">
          <div className="tbl-head">
            <span className="col-span-1">Idx</span>
            <span className="col-span-1">Year</span>
            <span className="col-span-4">Title</span>
            <span className="col-span-3">Stack</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-1 text-right">Link</span>
          </div>

          {PROJECTS.map((p) => {
            const content = (
              <>
                <span className="cell-mono col-span-1">{p.id}</span>
                <span className="cell-mono col-span-1">{p.year}</span>
                <span className="col-span-4 flex flex-col">
                  <span className="cell-title">{p.title}</span>
                  <span className="cell-sub">{p.summary}</span>
                </span>
                <span className="cell-stack col-span-3">
                  {p.stack.length ? p.stack.join(' · ') : '—'}
                </span>
                <span className="cell-mono col-span-2">{p.tag}</span>
                <span className="cell-arrow cell-link col-span-1 text-right">
                  {p.href ? '↗' : '—'}
                </span>
              </>
            );
            return p.href ? (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="tbl-row"
              >
                {content}
              </a>
            ) : (
              <div key={p.id} className="tbl-row">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section data-reveal="true" className="pb-24">
        <div className="grid-container border-rule grid grid-cols-12 items-center gap-6 border-t pt-12 max-md:grid-cols-1 max-md:gap-5">
          <div className="col-span-8 max-md:col-span-1">
            <h3 className="font-display text-bone m-0 text-[clamp(28px,3vw,40px)] font-medium leading-[1.1] tracking-[-0.02em]">
              Looking for production case studies?
            </h3>
            <p className="text-graphite m-0 mt-3 max-w-[54ch] text-[15px]">
              Most production work is internal to my employers and not something
              I can show publicly. Send a message and I&apos;ll walk through the
              parts I can talk about.
            </p>
          </div>
          <div className="col-span-4 text-right max-md:col-span-1 max-md:text-left">
            <Link href="/#contact" className="btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
