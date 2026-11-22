import { type JSX } from '@solidjs/web';
import { Box, Center, HStack, Span, Splitter, useBreakpointValue } from '../../src';

/** Show a collapsible first panel with the minimum sizes. */
export function SplitterCollapsible(): JSX.Element {
  return (
    <Box>
      <Box style={{ 'margin-bottom': 'var(--leverui-spacing-4)' }}>
        <HStack gap="2" textStyle="sm">
          <Span>Drag the handle to collapse or expand panel A</Span>
        </HStack>
      </Box>
      <Splitter.Root
        defaultSize={[40, 60]}
        panels={[
          { id: 'a', collapsible: true, collapsedSize: 5, minSize: 25 },
          { id: 'b', minSize: 50 },
        ]}
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
    </Box>
  );
}

/** Show the five-percent arrow-key resize behavior. */
export function SplitterKeyboardResize(): JSX.Element {
  return (
    <Box>
      <HStack
        gap="2"
        wrap="wrap"
        textStyle="sm"
        style={{
          'margin-bottom': 'var(--leverui-spacing-4)',
        }}
      >
        <Span>Focus the resize handle and use arrow keys</Span>
      </HStack>
      <Splitter.Root
        panels={[{ id: 'a' }, { id: 'b' }]}
        class="splitter-example-framed"
        keyboardResizeBy={5}
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
    </Box>
  );
}

/** Use the context API to reset resized panels with a double click. */
export function SplitterResetOnDoubleClick(): JSX.Element {
  return (
    <Splitter.Root
      defaultSize={[50, 50]}
      panels={[{ id: 'a' }, { id: 'b' }]}
      class="splitter-example-framed"
    >
      <Splitter.Panel id="a">
        <Box
          textStyle="2xl"
          style={{
            display: 'grid',
            'place-items': 'center',
            width: '100%',
            height: '100%',
          }}
        >
          A
        </Box>
      </Splitter.Panel>
      <Splitter.Context>
        {
          /** Render a handle that restores the initial sizes on double click. */
          (context) => (
            <Splitter.ResizeTrigger
              id="a:b"
              onDblClick={
                /** Restore the splitter's initial panel sizes. */
                () => context().resetSizes()
              }
            />
          )
        }
      </Splitter.Context>
      <Splitter.Panel id="b">
        <Box
          textStyle="2xl"
          style={{
            display: 'grid',
            'place-items': 'center',
            width: '100%',
            height: '100%',
          }}
        >
          B
        </Box>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Switch between vertical and horizontal layouts at the medium breakpoint. */
export function SplitterResponsiveOrientation(): JSX.Element {
  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'vertical',
    md: 'horizontal',
  });

  return (
    <Splitter.Root
      panels={[{ id: 'a' }, { id: 'b' }]}
      orientation={orientation()}
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
  );
}
