import { type JSX } from '@solidjs/web';
import { Center, Splitter } from '../../src';
import './splitter-center.css';

/** Show the default two-panel Splitter example. */
export function SplitterBasic(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} class="splitter-example-framed">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Show the panels arranged vertically. */
export function SplitterVertical(): JSX.Element {
  return (
    <Splitter.Root
      panels={[{ id: 'a' }, { id: 'b' }]}
      orientation="vertical"
      class="splitter-example-framed"
    >
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Show a disabled resize handle between the two panels. */
export function SplitterDisabled(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} class="splitter-example-framed">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" disabled />
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Show only the separator line inside the resize handle. */
export function SplitterSeparatorOnly(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} class="splitter-example-framed">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b">
        <Splitter.ResizeTriggerSeparator />
      </Splitter.ResizeTrigger>
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Match the basic example in its private Explorer story. */
export function SplitterExplorerDemo(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} class="splitter-example-framed">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Show three panels with a resize handle between each pair. */
export function SplitterMultiplePanels(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }, { id: 'c' }]} class="splitter-example-framed">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" aria-label="Resize" />
      <Splitter.Panel id="b">
        <Center class="splitter-example-center">B</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="b:c" aria-label="Resize" />
      <Splitter.Panel id="c">
        <Center class="splitter-example-center">C</Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}

/** Show a vertical splitter nested inside its right panel. */
export function SplitterNested(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} class="splitter-example-border">
      <Splitter.Panel id="a">
        <Center class="splitter-example-center">A</Center>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" aria-label="Resize" />
      <Splitter.Panel id="b">
        <Splitter.Root
          panels={[{ id: 'b1' }, { id: 'b2' }]}
          orientation="vertical"
          class="splitter-example-min-80"
        >
          <Splitter.Panel id="b1">
            <Center class="splitter-example-center">B1</Center>
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="b1:b2" aria-label="Resize nested panels" />
          <Splitter.Panel id="b2">
            <Center class="splitter-example-center">B2</Center>
          </Splitter.Panel>
        </Splitter.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
