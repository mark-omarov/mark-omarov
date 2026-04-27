'use client';

import { useEffect, useState } from 'react';
import { Sigil } from '~/components/primitives-server';
import { useInView } from '~/components/primitives-client';

interface Layer {
  label: string;
  items: string[];
}

interface StackDiagramProps {
  layers: Layer[];
  totalCount: number;
}

export function StackDiagram({ layers, totalCount }: StackDiagramProps) {
  const [setRef, seen] = useInView<HTMLDivElement>();
  const [bootStarted, setBootStarted] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setBootStarted(true), 350);
    return () => clearTimeout(t);
  }, [seen]);

  let chipIndex = 0;
  const indexed = layers.map((layer) => {
    const items = layer.items.map((it) => ({ name: it, idx: chipIndex++ }));
    return { ...layer, items };
  });

  return (
    <div
      ref={setRef}
      data-boot={bootStarted ? 'true' : 'false'}
      className="bg-paper relative flex flex-col gap-5 overflow-hidden p-10"
    >
      <div className="flex items-center justify-between">
        <Sigil dim>HOMELAB.STACK</Sigil>
        <Sigil dim>{totalCount} components</Sigil>
      </div>

      <span
        aria-hidden
        className="text-signal pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] opacity-[0.85] transition-opacity duration-[400ms] data-[booted=true]:opacity-0 max-md:hidden"
        data-booted={bootStarted ? 'true' : 'false'}
      >
        ◇ booting layers
      </span>

      <div className="bg-rule grid gap-px">
        {indexed.map((layer) => (
          <div
            key={layer.label}
            className="stack-layer bg-paper grid grid-cols-[160px_1fr] items-center gap-4 px-4 py-3.5 max-md:grid-cols-1 max-md:gap-2"
          >
            <span className="text-graphite font-mono text-[11px] uppercase tracking-[0.14em]">
              {layer.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {layer.items.map((it) => (
                <span
                  key={it.name}
                  data-idx={it.idx}
                  className="stack-chip px-2 py-1 font-mono text-[11px] tracking-[0.12em]"
                >
                  {it.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-rule mt-auto flex flex-col gap-2 border-t pt-5">
        <Sigil dim>Single-node · Proxmox · GPU passthrough · GitOps</Sigil>
        <Sigil accent>Production patterns, hands-on</Sigil>
      </div>
    </div>
  );
}
