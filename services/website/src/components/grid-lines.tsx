export function GridLines() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(0deg, transparent 24%, rgba(74, 222, 128, 0.2) 25%, rgba(74, 222, 128, 0.2) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.2) 75%, rgba(74, 222, 128, 0.2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(74, 222, 128, 0.2) 25%, rgba(74, 222, 128, 0.2) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.2) 75%, rgba(74, 222, 128, 0.2) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        }}
      ></div>
    </div>
  );
}
