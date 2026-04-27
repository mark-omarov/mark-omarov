'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Sigil } from '~/components/primitives-server';
import {
  type Certificate,
  CERT_CATEGORY_LABELS,
  fmtCertDate,
} from '~/data/certificates';

const ISSUER_CLASS: Record<string, string> = {
  FrontendMasters: 'text-[#c00]',
  'Boot.dev': 'text-[#9b87ff]',
  Google: 'text-[#4285F4]',
  'New Relic': 'text-[#00ac69]',
  Udemy: 'text-[#a435f0]',
};

interface CertDetailPanelProps {
  cert: Certificate | null;
  onClose: () => void;
}

export function CertDetailPanel({ cert, onClose }: CertDetailPanelProps) {
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cert) setImgState('loading');
  }, [cert?.url, cert]);

  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusT = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusT);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  const issuerColorClass = ISSUER_CLASS[cert.issuer] ?? 'text-signal';
  const categoryLabel = CERT_CATEGORY_LABELS[cert.category] ?? cert.category;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className="animate-panel-scrim fixed inset-0 z-[90] bg-black/50 backdrop-blur-[4px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Credential detail: ${cert.title}`}
        className="border-rule bg-ink animate-panel-slide-in fixed inset-y-0 right-0 z-[100] flex w-[min(720px,100vw)] flex-col overflow-y-auto border-l max-md:w-screen"
      >
        <header className="border-rule bg-ink sticky top-0 z-[1] flex items-center justify-between border-b px-10 py-6 max-md:px-6 max-md:py-[18px]">
          <Sigil>Credential / Detail</Sigil>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close credential detail"
            type="button"
            className="border-rule text-bone cursor-pointer whitespace-nowrap border bg-transparent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Close · ESC
          </button>
        </header>

        <div className="border-rule bg-paper border-b p-10 pb-6 max-md:p-6">
          <div className="border-rule bg-ink relative flex aspect-[4/3] items-center justify-center overflow-hidden border">
            {imgState !== 'error' && (
              <Image
                src={cert.image}
                alt={`${cert.title} certificate`}
                onLoad={() => setImgState('loaded')}
                onError={() => setImgState('error')}
                fill
                sizes="(max-width: 720px) 100vw, 720px"
                data-state={imgState}
                className="object-contain opacity-0 transition-opacity duration-300 data-[state=loaded]:opacity-100"
              />
            )}

            {imgState === 'loading' && (
              <div className="text-graphite absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="inline-flex items-center gap-2">
                  <span className="bg-signal animate-breathe h-1.5 w-1.5" />
                  Loading credential
                </span>
              </div>
            )}

            {imgState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <div
                  className={cn(
                    'mb-[18px] font-mono text-[10px] uppercase tracking-[0.22em]',
                    issuerColorClass
                  )}
                >
                  {cert.issuer} · Credential
                </div>
                <div className="font-display text-bone max-w-[20ch] text-[22px] leading-[1.2] tracking-[-0.01em]">
                  {cert.title}
                </div>
                <div className="border-rule text-graphite mt-5 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.18em]">
                  Image not available · view original below
                </div>
              </div>
            )}
          </div>
          <div className="text-graphite mt-3.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
            <span>Issued · {fmtCertDate(cert.date)}</span>
            <span>{cert.type}</span>
          </div>
        </div>

        <div className="flex-1 p-10 max-md:px-6 max-md:py-7">
          <div
            className={cn(
              'font-mono text-[11px] uppercase tracking-[0.18em]',
              issuerColorClass
            )}
          >
            {cert.issuer}
          </div>
          <h2 className="font-display text-bone mt-3.5 text-[clamp(28px,4vw,40px)] font-medium leading-[1.1] tracking-[-0.015em]">
            {cert.title}
          </h2>

          {cert.note && (
            <p className="text-graphite mt-6 max-w-[52ch] text-base leading-[1.6]">
              {cert.note}
            </p>
          )}

          <dl className="border-rule mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-7 max-md:grid-cols-1 max-md:gap-5">
            <div>
              <dt className="text-graphite font-mono text-[10px] uppercase tracking-[0.18em]">
                Issuer
              </dt>
              <dd className="text-bone mt-1.5 text-[15px]">{cert.issuer}</dd>
            </div>
            <div>
              <dt className="text-graphite font-mono text-[10px] uppercase tracking-[0.18em]">
                Date
              </dt>
              <dd className="text-bone mt-1.5 text-[15px] tabular-nums">
                {fmtCertDate(cert.date)}
              </dd>
            </div>
            <div>
              <dt className="text-graphite font-mono text-[10px] uppercase tracking-[0.18em]">
                Type
              </dt>
              <dd className="text-bone mt-1.5 text-[15px]">{cert.type}</dd>
            </div>
            <div>
              <dt className="text-graphite font-mono text-[10px] uppercase tracking-[0.18em]">
                Category
              </dt>
              <dd className="text-bone mt-1.5 text-[15px]">{categoryLabel}</dd>
            </div>
          </dl>

          <a
            href={cert.url}
            target="_blank"
            rel="noreferrer"
            className="border-rule text-bone mt-9 flex items-center justify-between border px-6 py-5 font-mono text-xs uppercase tracking-[0.14em] no-underline transition-colors duration-200"
          >
            <span>View official credential</span>
            <span className="text-base">↗</span>
          </a>
        </div>
      </aside>
    </>
  );
}
