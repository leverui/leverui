import { type JSX } from '@solidjs/web';
import { PackedClientOnly } from './client-only-example';
import { PackedEnvironment } from './environment-example';
import { PackedFor } from './for-example';
import { PackedLocale } from './locale-example';

/** Render packaged environment and collection utilities. */
export default function PackedUtilityContext(): JSX.Element {
  return (
    <>
      <PackedClientOnly />
      <PackedEnvironment />
      <PackedFor />
      <PackedLocale />
    </>
  );
}
