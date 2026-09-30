import type { TargetAndTransition } from 'framer-motion';
import type { Animal, AnimalMotion } from '../../data/animals';
import { Bubble, BubbleImage } from '../Bubble/Bubble';

/** Each animal celebrates in its own way when found. */
export const animalWinAnimations: Record<AnimalMotion, TargetAndTransition> = {
  jump: { y: [0, -70, 0, -25, 0], rotate: [0, -10, 10, 0], transition: { duration: 0.9 } },
  wag: { rotate: [0, -14, 14, -14, 14, -8, 8, 0], y: [0, -10, 0], transition: { duration: 1 } },
  roar: { scale: [1, 1.35, 1.25, 1.35, 1.15], rotate: [0, -4, 4, 0], transition: { duration: 1 } },
  sway: { rotate: [0, -12, 12, -10, 10, 0], x: [0, -12, 12, -8, 8, 0], transition: { duration: 1.2 } },
  hop: { y: [0, -40, 0, -40, 0, -40, 0], transition: { duration: 1.1 } },
  peck: { rotate: [0, 25, 0, 25, 0, 25, 0], transition: { duration: 0.9 } },
  gallop: { x: [0, 20, -20, 20, 0], y: [0, -25, 0, -25, 0], rotate: [0, -8, 0, -8, 0], transition: { duration: 1 } },
};

interface AnimalCardProps {
  animal: Animal;
  /** Show the Arabic name under the animal (after she finds it). */
  showName: boolean;
}

/** A big friendly animal in a soft bubble. */
export function AnimalCard({ animal, showName }: AnimalCardProps) {
  return (
    <Bubble tint={animal.tint} edge={animal.edge} label={showName ? animal.name : null}>
      <BubbleImage src={animal.image} alt={animal.name} fallback={animal.emoji} />
    </Bubble>
  );
}
