import { type JSX } from '@solidjs/web';
import type { RatingGroupIconProps } from './rating-group-part-props';

/** Draw the star shape for one Rating Group color layer. */
export function RatingGroupStarIcon(props: RatingGroupIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
