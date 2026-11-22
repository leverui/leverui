import { type JSX } from '@solidjs/web';

export type StatDirection = 'up' | 'down';

/** Draw the trend arrow in the requested direction. */
export function StatArrow(props: { direction: StatDirection }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {props.direction === 'up' ? (
        <>
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </>
      ) : (
        <>
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </>
      )}
    </svg>
  );
}
