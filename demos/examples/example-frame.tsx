import { type JSX } from '@solidjs/web';
import { Box } from '../../src';
import './example-frame.css';

/** Apply the 16px inset to a layout story. */
export function withLayoutInset(Story: () => JSX.Element): JSX.Element {
  return (
    <>
      <Box class="example-layout-inset">
        <Story />
      </Box>
    </>
  );
}

/** Apply the 40px inset to a component story. */
export function withComponentInset(Story: () => JSX.Element): JSX.Element {
  return (
    <>
      <Box class="example-component-inset">
        <Story />
      </Box>
    </>
  );
}
