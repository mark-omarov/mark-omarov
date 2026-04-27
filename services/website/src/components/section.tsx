import type { ReactNode } from 'react';
import { Sigil } from '~/components/primitives-server';

interface SectionProps {
  eyebrow: string;
  title: string;
  id?: string;
  children: ReactNode;
}

export function Section({ eyebrow, title, id, children }: SectionProps) {
  return (
    <section
      id={id}
      data-reveal="true"
      className="scroll-mt-20 pb-6 pt-24 max-md:py-12"
    >
      <div className="grid-container">
        <div className="mb-12 grid grid-cols-12 gap-6 max-md:mb-7 max-md:grid-cols-1 max-md:gap-3">
          <div className="col-span-3 max-md:col-span-1">
            <Sigil>{eyebrow}</Sigil>
          </div>
          <h2 className="font-display text-bone col-span-9 m-0 text-[clamp(36px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.025em] max-md:col-span-1 max-md:text-[clamp(30px,8vw,44px)]">
            {title}
          </h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
