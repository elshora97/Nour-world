import { useEffect, useState } from 'react';

/**
 * A phone held upright: touch screen, portrait, and narrow. Tablets
 * (≥768px wide in portrait) and desktops are never matched, so they
 * stay usable in any orientation.
 */
const PHONE_PORTRAIT = '(orientation: portrait) and (pointer: coarse) and (max-width: 767px)';

export function useIsPhonePortrait(): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(PHONE_PORTRAIT).matches);

  useEffect(() => {
    const query = window.matchMedia(PHONE_PORTRAIT);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return matches;
}
