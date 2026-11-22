import { type JSX } from '@solidjs/web';

export type CopyStatusIconProps = { style?: JSX.CSSProperties };

/** Render the shared decorative copy glyph at the current text size. */
export function CopyStatusCopyIcon(props: CopyStatusIconProps = {}): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={props.style}
    >
      <rect x="8" y="8" width="14" height="14" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

/** Render the shared decorative copied confirmation glyph. */
export function CopyStatusCheckIcon(props: CopyStatusIconProps = {}): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={props.style}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
