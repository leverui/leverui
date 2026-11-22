import { type JSX } from '@solidjs/web';
import type { Demo, DemoMeta } from './demo-types';
import { Box, Container, For, Stack } from '../src';
import { withComponentInset } from './examples/example-frame';
import './container-examples.css';

const exampleText =
  'This text sits inside a container. The container sets how wide the text can get and adds space on its left and right sides.';

/** Show a regular centered Container with patterned content. */
function ContainerBasic(): JSX.Element {
  return (
    <Container>
      <Box class="container-example-pattern container-example-pattern--padded">{exampleText}</Box>
    </Container>
  );
}

/** Compare four Container maximum widths with the same content. */
function ContainerWithSizes(): JSX.Element {
  return (
    <Stack>
      <For each={['sm', 'md', 'xl', '2xl'] as const}>
        {
          /** Render one maximum width. */
          (size) => (
            <Container class={`container-example-size container-example-size-${size}`}>
              <Box class="container-example-pattern">{exampleText}</Box>
            </Container>
          )
        }
      </For>
    </Stack>
  );
}

/** Let the patterned Container span the available width. */
function ContainerWithFluid(): JSX.Element {
  return (
    <Container fluid>
      <Box class="container-example-pattern container-example-pattern--padded">{exampleText}</Box>
    </Container>
  );
}

export const meta = {
  component: ContainerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: ContainerBasic };
export const Sizes: Story = {
  render: ContainerWithSizes,
  parameters: {
    guide: {
      description: 'Use a CSS class to set a different maximum width for each container.',
    },
  },
};
export const Fluid: Story = {
  render: ContainerWithFluid,
  parameters: {
    guide: {
      description: 'Set `fluid` to stretch the container across its parent.',
    },
  },
};
