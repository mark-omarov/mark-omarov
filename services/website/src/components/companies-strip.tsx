'use client';

import Link from 'next/link';
import { Sigil } from '~/components/primitives-server';
import { Cursor } from '~/components/primitives-server';
import { Typewriter, useInView } from '~/components/primitives-client';
import { COMPANIES, PERSONAL } from '~/data/content';

export function CompaniesStrip() {
  const [setRef, seen] = useInView<HTMLElement>();

  return (
    <section
      ref={setRef}
      data-reveal="true"
      className="pb-6 pt-24 max-md:py-12"
    >
      <div className="grid-container">
        <div className="mb-12 grid grid-cols-12 gap-6 max-md:mb-7 max-md:grid-cols-1 max-md:gap-3">
          <div className="col-span-3 max-md:col-span-1">
            <Sigil>03 / Track Record</Sigil>
          </div>
          <h2 className="font-display text-bone col-span-9 m-0 text-[clamp(36px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.025em] max-md:col-span-1 max-md:text-[clamp(30px,8vw,44px)]">
            Where I&apos;ve shipped.
          </h2>
        </div>

        <div
          className="border-rule border-y py-9"
          data-seen={seen ? 'true' : 'false'}
        >
          <div className="flex flex-wrap items-baseline justify-start gap-x-[clamp(20px,3.2vw,56px)] gap-y-[18px]">
            {COMPANIES.map((name) => (
              <span
                key={name}
                className="company-item font-display text-bone whitespace-nowrap text-[clamp(24px,3.2vw,44px)] font-medium leading-none tracking-[-0.025em]"
              >
                {name}
              </span>
            ))}

            <Link
              href="/#contact"
              aria-label="Get in touch about a role at your company"
              className="company-item font-display text-signal group inline-flex items-baseline gap-1.5 whitespace-nowrap border-0 bg-transparent p-0 text-[clamp(24px,3.2vw,44px)] font-medium leading-none tracking-[-0.025em] no-underline"
            >
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                [
              </span>
              <span className="relative">
                <span className="inline-block opacity-90 transition-opacity duration-200 group-hover:opacity-100">
                  <Typewriter
                    text="your company?"
                    charDelay={70}
                    startDelay={400}
                    trigger={seen}
                    storageKey="om:companies-typewriter"
                  />
                </span>
                <Cursor tall />
              </span>
              <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">
                ]
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-graphite font-mono text-[11px] uppercase tracking-[0.16em]">
            {PERSONAL.yearsShipping} years · {COMPANIES.length} companies · 1
            vacancy
          </span>
          <Link
            href="/#contact"
            className="link-arrow border-signal text-signal"
          >
            Fill the slot <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
