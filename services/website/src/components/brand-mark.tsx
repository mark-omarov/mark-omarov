interface BrandMarkProps {
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export function BrandMark({
  size = 28,
  className,
  ariaLabel = 'mo',
}: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <path
        d="M 30 28 L 20 28 L 20 72 L 30 72"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M 70 28 L 80 28 L 80 72 L 70 72"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <text
        x={50}
        y={63}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, Menlo, monospace"
        fontSize={34}
        fontWeight={600}
        fill="currentColor"
        letterSpacing={-1}
      >
        mo
      </text>
    </svg>
  );
}
