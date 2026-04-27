import type { ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

interface SigilProps {
  children: ReactNode;
  accent?: boolean;
  dim?: boolean;
  className?: string;
}

export function Sigil({ children, accent, dim, className }: SigilProps) {
  return (
    <span
      className={cn(
        'sigil',
        accent && 'sigil-accent',
        dim && 'sigil-dim',
        className
      )}
    >
      {children}
    </span>
  );
}

interface DotProps {
  size?: 6 | 8;
  pulse?: boolean;
}

export function Dot({ size = 8, pulse }: DotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-signal inline-block flex-none rounded-full',
        size === 6 ? 'h-1.5 w-1.5' : 'h-2 w-2',
        pulse && 'breathe-dot animate-dot-breathe'
      )}
    />
  );
}

interface CursorProps {
  tall?: boolean;
}

export function Cursor({ tall }: CursorProps = {}) {
  return (
    <span
      aria-hidden
      data-cursor-blink="true"
      className={cn(
        'bg-signal animate-cursor-fade ml-[0.18em] inline-block w-[3px] align-[-0.04em] opacity-90',
        tall ? 'h-[0.8em]' : 'h-[0.78em]'
      )}
    />
  );
}
