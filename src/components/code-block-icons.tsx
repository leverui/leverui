import { type JSX } from '@solidjs/web';

export {
  CopyStatusCopyIcon as CodeBlockCopyIcon,
  CopyStatusCheckIcon as CodeBlockCheckIcon,
} from './copy-status-icons';

/** Render the default expanded-state collapse glyph. */
export function CodeBlockChevronUpIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 15 6-6 6 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

/** Render the default collapsed-state expand glyph. */
export function CodeBlockChevronDownIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
