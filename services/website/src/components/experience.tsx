import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';
import { Section } from '~/components/section';
import { Dot } from '~/components/primitives-server';
import { EXPERIENCE, PERSONAL } from '~/data/content';

export function ExperienceSection() {
  return (
    <Section eyebrow="02 / Experience" title="A decade of shipping.">
      <div className="grid gap-0">
        {EXPERIENCE.map((j, i) => (
          <div
            key={`${j.company}-${j.dates}`}
            className={cn(
              'border-rule grid grid-cols-[180px_1fr] gap-8 border-t max-md:grid-cols-1 max-md:gap-4 max-md:py-7',
              j.compact ? 'py-6 opacity-[0.78]' : 'py-10',
              i === EXPERIENCE.length - 1 && 'border-b'
            )}
          >
            <div>
              <div
                className={cn(
                  'mb-2 flex items-center gap-2 whitespace-nowrap font-mono text-xs tracking-[0.12em]',
                  j.isCurrent ? 'text-signal' : 'text-graphite'
                )}
              >
                {j.isCurrent ? <Dot size={6} pulse /> : null}
                {j.dates}
              </div>
              <div className="text-graphite font-mono text-[11px] uppercase tracking-[0.14em]">
                {j.location}
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  'font-display text-bone m-0 font-medium leading-[1.12] tracking-[-0.02em]',
                  j.compact ? 'text-xl' : 'text-[28px]'
                )}
              >
                {j.title}, <span className="text-graphite">{j.company}</span>
              </h3>
              <p
                className={cn(
                  'text-graphite max-w-[64ch] leading-[1.55]',
                  j.compact ? 'mt-2 text-sm' : 'mt-3 text-[15px]'
                )}
              >
                {j.summary}
              </p>

              {j.wins.length > 0 && (
                <ul className="bg-rule mt-6 grid list-none gap-px p-0">
                  {j.wins.map((w) => (
                    <li
                      key={`${w.tag}-${w.label}`}
                      className="win-row bg-ink grid grid-cols-[110px_1fr] items-baseline gap-5 py-4 max-md:grid-cols-1 max-md:gap-1.5"
                    >
                      <span className="text-signal font-mono text-[11px] uppercase tracking-[0.16em]">
                        {w.tag}
                      </span>
                      <div>
                        <div className="text-bone text-[15px] font-medium tracking-[-0.005em]">
                          {w.label}
                        </div>
                        <div className="text-graphite mt-1 text-[13px] leading-[1.5]">
                          {w.detail}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={PERSONAL.linkedin}
          target="_blank"
          rel="noreferrer"
          className="link-arrow"
        >
          Full work history on LinkedIn{' '}
          <span className="arrow arrow-up">↗</span>
        </Link>
        <div className="text-graphite flex flex-col gap-1.5 text-right font-mono text-[11px] uppercase tracking-[0.14em]">
          <span>
            Education · Donetsk Industrial &amp; Pedagogical College, 2012–2014
          </span>
          <span>Languages · {PERSONAL.languages.join(' · ')}</span>
        </div>
      </div>
    </Section>
  );
}
