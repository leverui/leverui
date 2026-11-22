import { Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Badge, Box, Center, Wrap, WrapItem } from '../src';
import './examples/decorative-box.css';
import { withComponentInset } from './examples/example-frame';
import './wrap-examples.css';

/** Wrap three badges when available width becomes narrow. */
function WrapBasic(): JSX.Element {
  return (
    <Wrap>
      <Badge>Badge 1</Badge>
      <Badge>Badge 2</Badge>
      <Badge>Badge 3</Badge>
    </Wrap>
  );
}

/** Change wrapping gap and justification across breakpoints. */
function WrapResponsive(): JSX.Element {
  return (
    <Wrap gap={['12px', '24px']} justify={['center', 'flex-start']}>
      <Repeat count={11}>
        {() => (
          <Box
            class="example-decorative-box"
            data-decorative-width="12"
            data-decorative-height="12"
          />
        )}
      </Repeat>
    </Wrap>
  );
}

/** Align five red surfaces within wrapped items. */
function WrapWithAlign(): JSX.Element {
  return (
    <Wrap gap="30px" align="center">
      <Repeat count={5}>
        {(index) => (
          <WrapItem>
            <Center class="wrap-example-center">Box {index + 1}</Center>
          </WrapItem>
        )}
      </Repeat>
    </Wrap>
  );
}

/** Space ten patterned squares with one uniform gap. */
function WrapWithGap(): JSX.Element {
  return (
    <Wrap gap="5">
      <Repeat count={10}>
        {() => (
          <Box
            class="example-decorative-box"
            data-decorative-width="12"
            data-decorative-height="12"
          />
        )}
      </Repeat>
    </Wrap>
  );
}

/** Center five red surfaces across wrapped rows. */
function WrapWithJustify(): JSX.Element {
  return (
    <Wrap gap="30px" justify="center">
      <Repeat count={5}>
        {(index) => (
          <WrapItem>
            <Center class="wrap-example-center">Box {index + 1}</Center>
          </WrapItem>
        )}
      </Repeat>
    </Wrap>
  );
}

/** Apply independent responsive row and column gaps. */
function WrapWithRowColumnGap(): JSX.Element {
  return (
    <Wrap rowGap={['0px', '24px']} columnGap={['4px', '12px']}>
      <Repeat count={10}>
        {() => (
          <Box
            class="example-decorative-box"
            data-decorative-width="12"
            data-decorative-height="12"
          />
        )}
      </Repeat>
    </Wrap>
  );
}

export const meta = {
  component: WrapBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: WrapBasic };
export const Gap: Story = {
  render: WrapWithGap,
  parameters: guide(
    'Pass the `gap` prop to apply a consistent spacing between each child, even if it wraps.',
  ),
};
export const Align: Story = {
  render: WrapWithAlign,
  parameters: guide(
    'Pass the `align` prop to change the alignment of the child along the cross axis.',
  ),
};
export const Justify: Story = {
  render: WrapWithJustify,
  parameters: guide(
    'Pass the `justify` prop to change the alignment of the child along the main axis.',
  ),
};
export const RowColumnGap: Story = {
  name: 'RowColumnGap',
  render: WrapWithRowColumnGap,
  parameters: guide(
    'Pass the `rowGap` and `columnGap` props to apply a consistent spacing between the rows and columns.',
  ),
};
export const Responsive: Story = {
  render: WrapResponsive,
  parameters: guide(
    'Use responsive values for the `gap`, `rowGap`, and `columnGap` props to apply responsive spacing between each child.',
  ),
};
