import { type JSX } from '@solidjs/web';
import { PackedStack } from './stack-example';
import { PackedContainer } from './container-example';
import { PackedFlex } from './flex-example';
import { PackedFloat } from './float-example';
import { PackedGrid } from './grid-example';
import { PackedGroup } from './group-example';

/** Render the packaged container and flow layout specimens. */
export default function PackedLayoutContainers(): JSX.Element {
  return (
    <>
      <PackedStack />
      <PackedContainer />
      <PackedFlex />
      <PackedFloat />
      <PackedGrid />
      <PackedGroup />
    </>
  );
}
