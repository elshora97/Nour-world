import type { ReactNode } from 'react';
import { useIsPhonePortrait } from '../../hooks/useOrientation';

/** A cute phone that turns sideways, over and over. */
function RotatingPhone() {
  return (
    <svg viewBox="0 0 200 200" className="h-[32vh] w-[32vh] min-h-40 min-w-40" aria-hidden>
      {/* curved arrow showing the turn */}
      <path
        d="M 40 60 A 75 75 0 0 1 150 40"
        fill="none"
        stroke="var(--color-berry)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <path d="M 150 40 l -16 -4 l 8 14 z" fill="var(--color-berry)" />
      <g className="anim-rotate-phone" style={{ transformOrigin: '100px 110px' }}>
        <rect x="68" y="55" width="64" height="110" rx="14" fill="#fff" stroke="var(--color-ink)" strokeWidth="5" />
        <rect x="76" y="68" width="48" height="80" rx="6" fill="var(--color-sky-top)" />
        <circle cx="100" cy="156" r="3.5" fill="var(--color-ink)" />
        {/* tiny game on the screen */}
        <circle cx="90" cy="102" r="7" fill="var(--color-coral)" />
        <circle cx="110" cy="112" r="7" fill="var(--color-sun)" />
        <path d="M84 132 h32" stroke="var(--color-grass-dark)" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * The games are designed for landscape. On a phone held upright we cover
 * them with a friendly "turn the phone" screen; the game stays mounted
 * underneath, so turning the phone continues right where Nour was.
 */
export function LandscapeGuard({ children }: { children: ReactNode }) {
  const isPortraitPhone = useIsPhonePortrait();

  return (
    <>
      <div aria-hidden={isPortraitPhone} className="h-dvh w-full">
        {children}
      </div>
      {isPortraitPhone && (
        <div
          role="alert"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[4vh] px-6 text-center"
          style={{
            background: 'linear-gradient(180deg, var(--color-sky-top) 0%, #c9ecff 50%, var(--color-sky-bottom) 100%)',
          }}
        >
          <RotatingPhone />
          <p
            className="font-display text-[clamp(2rem,9vw,3.2rem)] font-extrabold leading-snug text-white"
            style={{ textShadow: '0 0.35rem 0 var(--color-berry)' }}
          >
            لفّي الموبايل بالعرض 🌸
          </p>
          <span className="anim-bob text-[clamp(3rem,16vw,5rem)]" aria-hidden>
            🐰
          </span>
        </div>
      )}
    </>
  );
}
