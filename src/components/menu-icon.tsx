import { type JSX } from '@solidjs/web';

/** Render the default selection mark without adding an accessible name. */
export function MenuCheckIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="var(--leverui-sizes-4)"
      height="var(--leverui-sizes-4)"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
