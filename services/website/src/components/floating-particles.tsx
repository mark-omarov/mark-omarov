export type FloatingParticlesProps = {
  amount?: number;
};

export function FloatingParticles({ amount = 50 }: FloatingParticlesProps) {
  return (
    <div className="absolute inset-0 opacity-20">
      {Array.from({ length: amount }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-green-400"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `
                    fadeIn 2s ease-out forwards,
                    float ${Math.random() * 10 + 10}s linear infinite ${Math.random() * 2}s
                  `,
            opacity: 0,
          }}
        ></div>
      ))}
    </div>
  );
}
