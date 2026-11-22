import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter, useSplitter } from '../src';
import './splitter-provider.css';

const panels = [{ id: 'a' }, { id: 'b' }];

/** Verify shared defaults and instance overrides on external machine roots. */
function ProviderDefaultsExample(): JSX.Element {
  const inherited = useSplitter({ panels, defaultSize: [40, 60] });
  const overridden = useSplitter({ panels, defaultSize: [55, 45] });
  const [providerRefTag, setProviderRefTag] = createSignal('none');

  /** Record the native child element delivered by RootProvider. */
  function recordProviderRef(element: Element): void {
    setProviderRefTag(element.tagName);
  }

  return (
    <Splitter.PropsProvider
      value={{
        class: 'shared-splitter',
        title: 'Shared splitter',
        defaultSize: [20, 80],
      }}
    >
      <div style={{ width: '300px', height: '100px' }}>
        <Splitter.RootProvider value={inherited} data-testid="splitter-provider-inherited">
          <Splitter.Panel id="a">A</Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-provider-first-trigger" />
          <Splitter.Panel id="b">B</Splitter.Panel>
        </Splitter.RootProvider>
      </div>
      <div style={{ width: '300px', height: '100px' }}>
        <Splitter.RootProvider
          value={overridden}
          class="instance-splitter"
          title="Instance splitter"
          data-testid="splitter-provider-overridden"
          ref={recordProviderRef}
          asChild={
            /** Forward the external machine to a caller-owned native root. */
            (getProps) => <div {...getProps()} />
          }
        >
          <Splitter.Panel id="a">A</Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-provider-second-trigger" />
          <Splitter.Panel id="b">B</Splitter.Panel>
        </Splitter.RootProvider>
        <output data-testid="splitter-provider-ref">{providerRefTag()}</output>
      </div>
    </Splitter.PropsProvider>
  );
}

const meta = {
  title: 'Layout/Splitter Provider',
  component: ProviderDefaultsExample,
} satisfies Meta<typeof ProviderDefaultsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Defaults: Story = {};
