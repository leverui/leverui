import { type JSX } from '@solidjs/web';
import type { IconHydrationComponents } from './icon-hydration-tree';

/** Render the documented JSX composition with published Icon components. */
export function renderIconJsxHydrationTree({
  Icon,
  IconPropsProvider,
}: IconHydrationComponents): JSX.Element {
  return (
    <>
      <IconPropsProvider value={{ size: 'sm', title: 'JSX icon' }}>
        <Icon id="jsx-hydrated-icon" viewBox="0 0 24 24">
          <path id="jsx-hydrated-path" d="M2 2h20v20H2z" />
        </Icon>
      </IconPropsProvider>
    </>
  );
}
