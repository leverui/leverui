import {
  Box,
  Center,
  HStack,
  Separator,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  SkipNavLink,
  Slider,
  Spinner,
  Splitter,
  Stack,
  Text,
} from '../../../../src';
import { type Component, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon } from './shared';

/** The plain block that layout demos arrange. */
const block = {
  height: '24px',
  'border-radius': 'var(--lui-radii-sm)',
  background: 'var(--overview-tint)',
};

/** A line between two rows, and a short line between two words. */
function SeparatorDemo(): JSX.Element {
  return (
    <Stack gap="2" style={{ width: '100%' }}>
      <Text textStyle="sm">Account</Text>
      <Separator />
      <HStack gap="3">
        <Text textStyle="sm">Profile</Text>
        <Separator orientation="vertical" style={{ height: '16px' }} />
        <Text textStyle="sm">Billing</Text>
      </HStack>
    </Stack>
  );
}

/** Show draws nothing of its own. */
function ShowDemo(): JSX.Element {
  return <HelperIcon name="signpost-split" />;
}

/** Six equal blocks in three columns. */
function SimpleGridDemo(): JSX.Element {
  return (
    <SimpleGrid columns={3} style={{ width: '100%', gap: '8px' }}>
      <For each={[1, 2, 3, 4, 5, 6]}>
        {/** Draw one grid cell. */}
        {() => <Box style={block} />}
      </For>
    </SimpleGrid>
  );
}

/** A loading avatar beside two loading lines. */
function SkeletonDemo(): JSX.Element {
  return (
    <HStack gap="3" style={{ width: '100%' }}>
      <SkeletonCircle size="10" />
      <SkeletonText noOfLines={2} />
    </HStack>
  );
}

/** The skip link as it looks when it has keyboard focus. */
function SkipNavDemo(): JSX.Element {
  return (
    <SkipNavLink as="span" data-focus-visible="" style={{ position: 'static', margin: '0' }}>
      Skip to content
    </SkipNavLink>
  );
}

/** A slider set a little under half way. */
function SliderDemo(): JSX.Element {
  return (
    <Slider.Root defaultValue={[40]} size="sm" style={{ width: '100%' }}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

/** Three spinners from small to large. */
function SpinnerDemo(): JSX.Element {
  return (
    <HStack gap="5">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </HStack>
  );
}

/** Two panels with a drag handle between them. */
function SplitterDemo(): JSX.Element {
  return (
    <Splitter.Root
      panels={[{ id: 'a' }, { id: 'b' }]}
      style={{
        width: '100%',
        height: '84px',
        border: '1px solid var(--lui-colors-border)',
        'border-radius': 'var(--lui-radii-md)',
      }}
    >
      <Splitter.Panel id="a">
        <Center style={{ height: '100%' }}>A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <Center style={{ height: '100%' }}>B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Three blocks in a column with even gaps. */
function StackDemo(): JSX.Element {
  return (
    <Stack gap="2" style={{ width: '100%' }}>
      <Box style={block} />
      <Box style={block} />
      <Box style={block} />
    </Stack>
  );
}

/** The overview demos for separator through stack, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  separator: SeparatorDemo,
  show: ShowDemo,
  'simple-grid': SimpleGridDemo,
  skeleton: SkeletonDemo,
  'skip-nav': SkipNavDemo,
  slider: SliderDemo,
  spinner: SpinnerDemo,
  splitter: SplitterDemo,
  stack: StackDemo,
};
