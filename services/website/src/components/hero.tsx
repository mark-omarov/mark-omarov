import Link from 'next/link';
import { Sigil } from '~/components/primitives-server';
import { CursorPlacer } from '~/components/primitives-client';
import { HeroClock } from '~/components/hero-clock';
import { PERSONAL, SIGNALS, STACK, THESIS } from '~/data/content';

export function Hero() {
  const sigil = `MARK OMAROV · TOKYO`;

  return (
    <section className="pb-18 pt-16">
      <div className="grid-container">
        <div className="hero-reveal mb-8 flex flex-wrap items-center gap-3.5 max-md:gap-2.5">
          <Sigil className="whitespace-nowrap">{sigil}</Sigil>
          <span className="bg-rule h-px w-6 max-md:hidden" />
          <Sigil dim className="whitespace-nowrap">
            Senior Product Engineer · Cogent Labs
          </Sigil>
          <span className="bg-rule h-px min-w-6 flex-1 max-md:hidden" />
          <Sigil accent className="whitespace-nowrap">
            Open to Senior IC / Tech Lead
          </Sigil>
        </div>

        <h1 className="font-display text-bone m-0 whitespace-nowrap text-[clamp(44px,6vw,92px)] font-medium leading-[0.94] tracking-[-0.038em] max-md:whitespace-normal max-md:text-[clamp(40px,11vw,64px)] max-sm:text-[clamp(34px,11vw,52px)]">
          <span className="hero-reveal block [animation-delay:120ms]">
            {THESIS.l1}
          </span>
          <span className="hero-reveal text-graphite block [animation-delay:240ms]">
            {THESIS.l2.replace(/\.$/, '')}
            <CursorPlacer punct="." delay={1100} />
          </span>
        </h1>

        <div className="hero-reveal mt-10 grid grid-cols-12 items-start gap-6 [animation-delay:440ms] max-md:grid-cols-1 max-md:gap-5">
          <div className="col-span-7 max-md:col-span-1">
            <p className="text-bone m-0 max-w-[46ch] text-lg leading-[1.55]">
              {THESIS.caption}
            </p>
          </div>
          <div className="border-signal bg-paper col-span-5 border-l-2 px-6 py-5 max-md:col-span-1">
            <Sigil dim>AI Approach</Sigil>
            <p className="font-display text-bone mb-0 mt-3 text-[22px] font-medium leading-[1.3] tracking-[-0.01em]">
              LLMs as engineering components, not magic. Spec, integrate,
              monitor, iterate.
            </p>
          </div>
        </div>

        <div className="hero-reveal border-rule mt-14 grid grid-cols-4 border-y [animation-delay:560ms] max-md:grid-cols-2">
          {SIGNALS.map((s) => (
            <div
              key={s.k}
              className="border-rule flex min-w-0 flex-col gap-1.5 border-l px-5 py-5 first:border-l-0 max-md:[&:nth-child(odd)]:border-l-0"
            >
              <Sigil dim>{s.k}</Sigil>
              <span className="font-display text-bone text-[22px] font-medium tracking-[-0.01em] [overflow-wrap:anywhere] max-md:text-[18px] max-md:[word-break:break-word]">
                {s.v}
              </span>
            </div>
          ))}
        </div>

        <div className="hero-reveal mt-6 flex flex-wrap items-center justify-between gap-4 [animation-delay:680ms]">
          <div className="text-graphite flex items-center gap-3.5 font-mono text-xs uppercase tabular-nums tracking-[0.14em]">
            <HeroClock />
            <span aria-hidden>·</span>
            <span>{PERSONAL.availability}</span>
            <span aria-hidden>·</span>
            <span>Reply &lt; 24h</span>
          </div>
          <div className="flex gap-2">
            <Link href="/#contact" className="btn-primary">
              Get in touch
            </Link>
            <Link
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Resume <span className="arrow arrow-up">↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-reveal border-rule mt-14 flex items-baseline gap-4 overflow-hidden whitespace-nowrap border-y py-4 [animation-delay:800ms] max-md:flex-col max-md:items-start max-md:gap-2.5 max-md:whitespace-normal">
          <Sigil className="flex-none">STACK_</Sigil>
          <span className="text-bone min-w-0 flex-1 overflow-hidden text-ellipsis font-mono text-[13px] uppercase tracking-[0.16em] max-md:overflow-visible max-md:whitespace-normal max-md:text-xs max-md:leading-[1.7] max-md:[text-overflow:clip]">
            {STACK.join('  ·  ')}
          </span>
        </div>
      </div>
    </section>
  );
}
