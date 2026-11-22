import { type JSX } from '@solidjs/web';
import { Center, Code, Splitter, Stack } from '../../src';
import './splitter-center.css';

/** Keep a navigation panel in pixel bounds while the main panel uses the remaining space. */
export function SplitterCssUnits(): JSX.Element {
  return (
    <Splitter.Root
      panels={[
        { id: 'nav', minSize: '240px', maxSize: '480px' },
        { id: 'main', minSize: 30 },
      ]}
      defaultSize={['240px', '60vw']}
      class="splitter-example-framed"
    >
      <Splitter.Panel id="nav">
        <Center class="splitter-example-center">Nav</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="nav:main" />
      <Splitter.Panel id="main">
        <Center class="splitter-example-center">Main</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Keep the sidebar's pixel width constant when the group resizes. */
export function SplitterResizeBehavior(): JSX.Element {
  return (
    <Splitter.Root
      panels={[
        { id: 'sidebar', minSize: 15, resizeBehavior: 'preserve-pixel-size' },
        { id: 'main' },
      ]}
      defaultSize={[25, 75]}
      class="splitter-example-framed"
    >
      <Splitter.Panel id="sidebar">
        <Stack align="center" justify="center" gap="2" class="example-splitter-fill">
          <Center class="example-splitter-title">Sidebar</Center>
          <Code size="sm" class="example-splitter-note">
            preserve-pixel-size
          </Code>
        </Stack>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="sidebar:main" />
      <Splitter.Panel id="main">
        <Center class="splitter-example-center">Main</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
