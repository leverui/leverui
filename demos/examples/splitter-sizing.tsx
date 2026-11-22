import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Center, Code, HStack, Span, Splitter, Stack, useSplitter } from '../../src';

/** Show the panel sizes as the controlled splitter moves. */
export function SplitterControlled(): JSX.Element {
  const [sizes, setSizes] = createSignal([50, 50]);

  return (
    <Stack gap="4" align="start">
      <HStack gap="2" textStyle="sm">
        <Span>Drag the handle to resize panels</Span>
      </HStack>
      <Splitter.Root
        panels={[{ id: 'a' }, { id: 'b' }]}
        size={sizes()}
        onResize={
          /** Keep the controlled sizes synchronized with pointer and keyboard resizing. */
          (details) => setSizes(details.size)
        }
        class="splitter-example-framed"
      >
        <Splitter.Panel id="a">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            A
          </Center>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            B
          </Center>
        </Splitter.Panel>
      </Splitter.Root>
      <Code style={{ color: 'var(--leverui-colors-fg-muted)' }}>
        Panel A: {sizes()[0]?.toFixed(1)}% | Panel B: {sizes()[1]?.toFixed(1)}%
      </Code>
    </Stack>
  );
}

/** Show an externally owned splitter store and its current panel sizes. */
export function SplitterWithStore(): JSX.Element {
  const splitter = useSplitter({
    defaultSize: [50, 50],
    panels: [{ id: 'a' }, { id: 'b', minSize: 20 }],
  });

  return (
    <Stack gap="4" align="start">
      <Splitter.RootProvider value={splitter} class="splitter-example-framed">
        <Splitter.Panel id="a">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            A
          </Center>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">
          <Center textStyle="2xl" style={{ width: '100%', height: '100%' }}>
            B
          </Center>
        </Splitter.Panel>
      </Splitter.RootProvider>
      <Code>
        Size:{' '}
        {JSON.stringify(
          splitter()
            .getSizes()
            .map(
              /** Format one size from the external splitter store. */
              (size) => size.toFixed(1),
            )
            .join('%, '),
        )}
      </Code>
    </Stack>
  );
}

/** Display the allowed range while a constrained splitter resizes. */
export function SplitterMinMaxConstraints(): JSX.Element {
  const [sizes, setSizes] = createSignal([30, 70]);

  return (
    <Stack gap="4" align="start">
      <HStack gap="2" textStyle="sm">
        <Span>Drag to resize. Panel A: 20% to 60%. Panel B: at least 40%.</Span>
      </HStack>
      <Splitter.Root
        panels={[
          { id: 'a', minSize: 20, maxSize: 60 },
          { id: 'b', minSize: 40 },
        ]}
        defaultSize={[30, 70]}
        size={sizes()}
        onResize={
          /** Keep the displayed percentages aligned with the constrained panel sizes. */
          (details) => setSizes(details.size)
        }
        class="splitter-example-framed"
      >
        <Splitter.Panel id="a">
          <Stack align="center" justify="center" gap="2" style={{ width: '100%', height: '100%' }}>
            <Center textStyle="2xl">A</Center>
            <Code size="sm" style={{ color: 'var(--leverui-colors-fg-muted)' }}>
              {sizes()[0]?.toFixed(1)}% (min: 20%, max: 60%)
            </Code>
          </Stack>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">
          <Stack align="center" justify="center" gap="2" style={{ width: '100%', height: '100%' }}>
            <Center textStyle="2xl">B</Center>
            <Code size="sm" style={{ color: 'var(--leverui-colors-fg-muted)' }}>
              {sizes()[1]?.toFixed(1)}% (min: 40%)
            </Code>
          </Stack>
        </Splitter.Panel>
      </Splitter.Root>
    </Stack>
  );
}
