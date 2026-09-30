/**
 * Decorative background: sky, sun, rainbow, clouds, hills, flowers.
 * Animations are plain CSS transforms (see index.css) so they run on the
 * compositor and never compete with game interactions on slow phones.
 */

const clouds = [
  { top: '8%', size: 150, duration: 70, delay: 0 },
  { top: '20%', size: 100, duration: 90, delay: -45 },
];

const sparkles = [
  { top: '14%', left: '12%', emoji: '⭐', delay: 0 },
  { top: '30%', left: '88%', emoji: '✨', delay: 1 },
  { top: '10%', left: '70%', emoji: '⭐', delay: 2 },
];

const flowers = [
  { left: '4%', emoji: '🌷' },
  { left: '22%', emoji: '🌼' },
  { left: '42%', emoji: '🌸' },
  { left: '62%', emoji: '🌻' },
  { left: '82%', emoji: '🌷' },
  { left: '94%', emoji: '🌼' },
];

const rainbow = ['#ff8a9a', '#ffc36b', '#fff08a', '#9be7b5', '#8fd0ff', '#c3aaff'];

function Cloud({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <g fill="#fff">
        <circle cx="30" cy="38" r="18" />
        <circle cx="52" cy="28" r="24" />
        <circle cx="74" cy="38" r="17" />
        <rect x="14" y="36" width="76" height="20" rx="10" />
      </g>
    </svg>
  );
}

export function SkyScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, var(--color-sky-top) 0%, #c9ecff 45%, var(--color-sky-bottom) 100%)',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          top: '-6vh',
          left: '-4vh',
          width: '26vh',
          height: '26vh',
          background: 'radial-gradient(circle, #fff6b0 0%, #ffd23f 60%, #ffd23f00 72%)',
        }}
      />

      <svg
        className="absolute opacity-60"
        style={{ right: '-6vw', top: '10vh', width: '34vw' }}
        viewBox="0 0 200 100"
      >
        {rainbow.map((color, i) => {
          const r = 90 - i * 8;
          return (
            <path
              key={color}
              d={`M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
              fill="none"
              stroke={color}
              strokeWidth="8"
            />
          );
        })}
      </svg>

      {clouds.map((c) => (
        <div
          key={c.top}
          className="anim-drift absolute left-0"
          style={{ top: c.top, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
        >
          <Cloud size={c.size} />
        </div>
      ))}

      {sparkles.map((s) => (
        <span
          key={`${s.top}-${s.left}`}
          className="anim-twinkle absolute text-[4vh]"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
        >
          {s.emoji}
        </span>
      ))}

      <span className="anim-flutter absolute text-[5vh]" style={{ top: '18%', left: '30%' }}>
        🦋
      </span>

      <svg
        className="absolute bottom-0 w-full"
        style={{ height: '26vh' }}
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
      >
        <path d="M0 90 Q 180 20 380 80 T 760 70 T 1000 60 V200 H0 Z" fill="var(--color-grass)" />
        <path d="M0 140 Q 250 80 520 130 T 1000 110 V200 H0 Z" fill="var(--color-grass-dark)" />
      </svg>

      {flowers.map((f) => (
        <span key={f.left} className="absolute bottom-[2vh] text-[5.5vh]" style={{ left: f.left }}>
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
