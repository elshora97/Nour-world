import type { ColorShape } from '../../data/colors';

interface ColorObjectProps {
  shape: ColorShape;
  fill: string;
  edge: string;
}

const starPoints = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 46 : 20;
  const a = (Math.PI / 5) * i - Math.PI / 2;
  return `${50 + r * Math.cos(a)},${54 + r * Math.sin(a)}`;
}).join(' ');

const petals = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return { cx: 50 + 24 * Math.cos(a), cy: 50 + 24 * Math.sin(a) };
});

function Body({ shape, fill, edge }: ColorObjectProps) {
  const common = { fill, stroke: edge, strokeWidth: 3, strokeLinejoin: 'round' as const };
  switch (shape) {
    case 'balloon':
      return (
        <>
          {/* curly string */}
          <path
            d="M50 84 C 44 88 56 92 50 96 C 46 99 52 101 50 104"
            fill="none"
            stroke="#8a7fa6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* knot */}
          <path d="M46 85 L54 85 L50 78 Z" {...common} />
          {/* balloon body: round top, gently pointed bottom */}
          <path d="M50 4 C 77 4 88 25 88 42 C 88 62 68 77 50 80 C 32 77 12 62 12 42 C 12 25 23 4 50 4 Z" {...common} />
          {/* soft shading on the lower side for a 3D look */}
          <path d="M20 52 C 26 68 40 76 50 77 C 38 72 28 64 20 52 Z" fill={edge} opacity="0.25" />
        </>
      );
    case 'star':
      return <polygon points={starPoints} {...common} />;
    case 'heart':
      return (
        <path
          d="M50 90 C 12 64 4 36 26 22 C 38 14 48 20 50 30 C 52 20 62 14 74 22 C 96 36 88 64 50 90 Z"
          {...common}
        />
      );
    case 'flower':
      return (
        <>
          {petals.map((p) => (
            <circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r="18" {...common} />
          ))}
          <circle cx="50" cy="50" r="22" {...common} />
        </>
      );
    case 'cloud':
      return (
        <path
          d="M24 78 C 8 78 4 58 18 52 C 14 36 32 26 44 34 C 50 18 76 20 78 40 C 94 40 98 62 86 70 C 84 76 80 78 74 78 Z"
          {...common}
        />
      );
  }
}

/** A cute colored object (balloon, star, ...) with a little face. */
export function ColorObject({ shape, fill, edge }: ColorObjectProps) {
  const isDark = fill === '#3a3446' || fill === '#a86b3c';
  const faceY = shape === 'balloon' ? 44 : shape === 'heart' ? 50 : 54;
  const eye = isDark ? '#fff' : '#3b2a5a';

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <Body shape={shape} fill={fill} edge={edge} />
      {/* Gloss highlight */}
      <ellipse cx="36" cy={faceY - 18} rx="9" ry="5" fill="#fff" opacity="0.55" transform={`rotate(-30 36 ${faceY - 18})`} />
      {/* Face */}
      <circle cx="42" cy={faceY} r="3.4" fill={eye} />
      <circle cx="58" cy={faceY} r="3.4" fill={eye} />
      <path d={`M44 ${faceY + 7} q6 5 12 0`} fill="none" stroke={eye} strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="36" cy={faceY + 6} rx="4" ry="2.4" fill="#ff8fb8" opacity="0.6" />
      <ellipse cx="64" cy={faceY + 6} rx="4" ry="2.4" fill="#ff8fb8" opacity="0.6" />
    </svg>
  );
}
