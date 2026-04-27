'use client';

import { useState } from 'react';
import { Sigil } from '~/components/primitives-server';
import { CertDetailPanel } from '~/components/cert-detail-panel';
import {
  ALL_CERTS,
  type Certificate,
  CERT_CATEGORIES,
  CERT_LEDGER,
  HEADLINE_CERTS,
  fmtCertDate,
} from '~/data/certificates';

export function CertificatesInteractive() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const total = ALL_CERTS.length;

  return (
    <>
      <section data-reveal="true" className="pb-24">
        <div className="grid-container border-rule bg-rule grid grid-cols-3 gap-px border max-md:grid-cols-1">
          {HEADLINE_CERTS.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setActiveCert(c)}
              type="button"
              className="cert-headline bg-ink text-bone hover:bg-paper flex min-h-[360px] w-full cursor-pointer flex-col justify-between border-0 p-8 text-left"
            >
              <div>
                <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between xl:gap-3">
                  <Sigil accent>0{i + 1} / Headline</Sigil>
                  <Sigil dim>{c.type}</Sigil>
                </div>
                <h3 className="font-display text-bone mt-8 max-w-[14ch] text-[28px] font-medium leading-[1.1] tracking-[-0.015em]">
                  {c.title}
                </h3>
                <p className="text-graphite mt-3.5 text-sm leading-[1.5]">
                  {c.note}
                </p>
              </div>
              <div className="border-rule mt-8 flex items-center justify-between border-t pt-5">
                <span className="text-bone font-mono text-xs uppercase tracking-[0.14em]">
                  {c.issuer}
                </span>
                <span className="text-graphite font-mono text-xs tracking-wider">
                  {fmtCertDate(c.date)} →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section data-reveal="true" className="pb-24">
        <div className="grid-container">
          <div className="border-rule flex items-center justify-between border-b pb-4">
            <Sigil>The Ledger</Sigil>
            <Sigil dim>
              {total} entries · {CERT_CATEGORIES.length} categories
            </Sigil>
          </div>

          {CERT_CATEGORIES.map((cat) => {
            const isOpen = !!open[cat.key];
            const items = CERT_LEDGER[cat.key] ?? [];
            return (
              <div key={cat.key} className="border-rule border-b">
                <button
                  onClick={() =>
                    setOpen((o) => ({ ...o, [cat.key]: !o[cat.key] }))
                  }
                  type="button"
                  className="ledger-head"
                >
                  <span className="flex items-center gap-[18px]">
                    <span className="ledger-toggle">{isOpen ? '−' : '+'}</span>
                    <span className="ledger-title">{cat.label}</span>
                  </span>
                  <span className="flex items-center gap-[18px]">
                    <span className="text-graphite font-mono text-xs uppercase tracking-[0.14em]">
                      {cat.count} entries
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-7 pl-10 max-md:pl-0">
                    <ul className="m-0 list-none p-0">
                      {items.map((it, i) => (
                        <li key={`${it.title}-${it.date}`}>
                          <button
                            onClick={() => setActiveCert(it)}
                            type="button"
                            className={`ledger-row group/lrow hover:bg-paper -ml-3 grid w-full cursor-pointer grid-cols-[110px_1fr_220px_30px] items-baseline gap-4 border-0 bg-transparent px-3 py-3.5 text-left max-lg:grid-cols-[90px_1fr_30px] max-md:grid-cols-[1fr_24px] max-md:gap-x-3 max-md:gap-y-1 max-md:p-2 ${i === 0 ? '' : 'border-rule border-t'}`}
                          >
                            <span className="text-graphite font-mono text-xs tabular-nums tracking-wider max-md:col-start-1 max-md:row-start-1 max-md:mb-0.5 max-md:text-[11px]">
                              {it.date}
                            </span>
                            <span className="text-bone text-[15px] max-md:col-start-1 max-md:row-start-2 max-md:text-sm">
                              {it.title}
                            </span>
                            <span className="text-graphite font-mono text-xs uppercase tracking-[0.14em] max-lg:hidden">
                              {it.issuer}
                            </span>
                            <span className="ledger-arrow text-graphite group-hover/lrow:text-signal text-right font-mono text-xs group-hover/lrow:translate-x-[3px] max-md:col-start-2 max-md:row-span-2 max-md:self-center">
                              →
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <CertDetailPanel cert={activeCert} onClose={() => setActiveCert(null)} />
    </>
  );
}
