import { type JSX } from '@solidjs/web';
import { PackedSeparator } from './separator-example';
import { PackedSpan } from './span-example';
import { PackedStrong } from './strong-example';
import { PackedStat } from './stat-example';

/** Render packaged separators, inline text, and statistics. */
export default function PackedContentInline(): JSX.Element {
  return (
    <>
      <PackedSeparator />
      <PackedSpan />
      <PackedStrong />
      <PackedStat />
    </>
  );
}
