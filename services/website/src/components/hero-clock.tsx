'use client';

import { useTokyoClock } from '~/components/primitives-client';

export function HeroClock() {
  const time = useTokyoClock();
  return <span>{time} JST</span>;
}
