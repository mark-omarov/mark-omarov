import type { Metadata } from 'next';
import Image from 'next/image';
import { Sigil } from '~/components/primitives-server';
import { RevealObserver } from '~/components/primitives-client';
import { CertificatesInteractive } from '~/components/certificates-view';
import { ALL_CERTS, HEADLINE_CERTS } from '~/data/certificates';

export const metadata: Metadata = {
  title: 'Credentials',
  description:
    'Headline credentials and a categorized ledger of certificates earned across frontend, backend, infrastructure, security, and language deep-dives.',
  alternates: { canonical: '/certificates' },
};

export default function CertificatesPage() {
  const headlineCount = HEADLINE_CERTS.length;
  const shelfCount = ALL_CERTS.length - headlineCount;

  return (
    <>
      <RevealObserver />

      <section className="pb-16 pt-16">
        <div className="grid-container">
          <div className="grid grid-cols-12 items-end gap-6 max-md:grid-cols-1 max-md:gap-4">
            <div className="col-span-8 max-md:col-span-1">
              <Sigil>CREDENTIALS / Index</Sigil>
              <h1 className="font-display text-bone m-0 mt-[18px] text-[clamp(56px,7vw,104px)] font-medium leading-[0.96] tracking-[-0.03em]">
                Three that count.
                <br />
                <span className="text-graphite">
                  {shelfCount} on the shelf.
                </span>
              </h1>
            </div>
            <div className="col-span-4 max-md:col-span-1">
              <p className="text-graphite m-0 max-w-[36ch] text-sm leading-[1.55]">
                Headline credentials first. Everything else is filed by
                category, default-collapsed, browsable on demand. Click any row
                to open the credential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CertificatesInteractive />

      <section data-reveal="true" className="pb-24">
        <div className="grid-container">
          <div className="border-rule grid grid-cols-12 items-center gap-6 border-t pt-12 max-md:grid-cols-1 max-md:gap-5">
            <div className="col-span-4 max-md:col-span-1">
              <Sigil>Holopin Board</Sigil>
              <p className="text-graphite mt-3 max-w-[34ch] text-sm leading-[1.55]">
                Open-source contribution badges. Decorative, kept for
                completeness.
              </p>
            </div>
            <div className="col-span-8 max-md:col-span-1">
              <div className="border-rule bg-paper relative aspect-[2428/764] w-full border">
                <Image
                  src="https://holopin.me/omarov"
                  alt="Holopin badge board for @omarov"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
