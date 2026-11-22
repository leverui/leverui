import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

/** Exercise inherited defaults, custom handle parts, and native composition. */
function CompositionExample(): JSX.Element {
  const [rootRefTag, setRootRefTag] = createSignal('none');

  /** Record the actual child element delivered by the root ref. */
  function recordRootRef(element: Element): void {
    setRootRefTag(element.tagName);
  }

  return (
    <>
      <Splitter.PropsProvider value={{ defaultSize: [30, 70] }}>
        <Splitter.Root
          panels={[{ id: 'a' }, { id: 'b' }]}
          style={{ width: '300px', height: '100px' }}
          data-testid="splitter-composed-root"
        >
          <Splitter.Panel id="a" data-testid="splitter-composed-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger
            id="a:b"
            asChild={
              /** Keep the primitive's behavior on the supplied native button. */
              (getProps) => <button {...getProps({})} data-testid="splitter-composed-trigger" />
            }
          >
            <Splitter.ResizeTriggerSeparator data-testid="splitter-composed-separator" />
            <Splitter.ResizeTriggerIndicator data-testid="splitter-composed-indicator" />
          </Splitter.ResizeTrigger>
          <Splitter.Panel id="b" data-testid="splitter-composed-b">
            B
          </Splitter.Panel>
        </Splitter.Root>
        <Splitter.Root
          panels={[{ id: 'plain-a' }, { id: 'plain-b' }]}
          defaultSize={[50, 50]}
          style={{ width: '300px', height: '100px' }}
          unstyled
          data-testid="splitter-unstyled-root"
        >
          <Splitter.Panel id="plain-a">A</Splitter.Panel>
          <Splitter.ResizeTrigger id="plain-a:plain-b" data-testid="splitter-unstyled-trigger" />
          <Splitter.Panel id="plain-b">B</Splitter.Panel>
        </Splitter.Root>
        <output data-testid="splitter-child-root-ref">{rootRefTag()}</output>
        <Splitter.Root
          panels={[{ id: 'child-a' }, { id: 'child-b' }]}
          defaultSize={[40, 60]}
          style={{ width: '300px', height: '100px' }}
          ref={recordRootRef}
          asChild={
            /** Keep the primitive machine props on the consumer-owned native root. */
            (getProps) => <div {...getProps()} data-testid="splitter-child-root" />
          }
        >
          <Splitter.Panel id="child-a">A</Splitter.Panel>
          <Splitter.ResizeTrigger id="child-a:child-b" data-testid="splitter-child-trigger" />
          <Splitter.Panel id="child-b">B</Splitter.Panel>
        </Splitter.Root>
      </Splitter.PropsProvider>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Composition',
  component: CompositionExample,
} satisfies Meta<typeof CompositionExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Parts: Story = {};
