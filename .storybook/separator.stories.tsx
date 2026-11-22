import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Separator, SeparatorPropsProvider } from '../src';

/** Exercise all authored CSS axes, semantic orientation, and provider changes. */
function SeparatorContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [vertical, setVertical] = createSignal(false);

  /** Mark the native element selected through the public ref. */
  function markRef(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the provider's default size without remounting descendants. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change a single separator's semantic and visual orientation. */
  function toggleOrientation(): void {
    setVertical(!vertical());
  }

  return (
    <div style={{ width: '320px', display: 'grid', gap: '12px' }}>
      <style>{'.separator-local-css { border-color: rgb(239, 68, 68); }'}</style>
      <Separator data-testid="separator-default" title="Section divider" ref={markRef} />
      <Separator variant="dashed" data-testid="separator-dashed" />
      <Separator variant="dotted" data-testid="separator-dotted" />
      <Separator size="xs" data-testid="separator-xs" />
      <Separator size="md" data-testid="separator-md" />
      <Separator size="lg" data-testid="separator-lg" />
      <Separator
        size={{ base: 'xs', md: 'lg' }}
        variant={{ base: 'dashed', md: 'dotted' }}
        data-testid="separator-responsive-axes"
      />
      <Separator
        orientation="vertical"
        style={{ height: '24px' }}
        data-testid="separator-vertical"
      />
      <Separator
        orientation={{ base: 'vertical', md: 'horizontal' }}
        style={{ height: '24px' }}
        data-testid="separator-responsive"
      />
      <Separator
        orientation={vertical() ? 'vertical' : 'horizontal'}
        style={{ height: '24px' }}
        data-testid="separator-reactive"
      />
      <Separator as="div" ref={markRef} data-testid="separator-selected" />
      <Separator
        asChild={
          /** Apply separator styling to the consumer-owned span. */
          (getProps) => <span {...getProps({})} data-testid="separator-child" />
        }
      />
      <Separator unstyled class="consumer-unstyled" data-testid="separator-unstyled" />
      <Separator class="consumer-separator" data-testid="separator-consumer-css" />
      <Separator class="separator-local-css" data-testid="separator-local-css" />
      <div
        style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}
        data-testid="separator-label-start"
      >
        <span style={{ 'flex-shrink': '0' }}>Label (start)</span>
        <Separator style={{ flex: '1' }} />
      </div>
      <div
        style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}
        data-testid="separator-label-end"
      >
        <Separator style={{ flex: '1' }} />
        <span style={{ 'flex-shrink': '0' }}>Label (end)</span>
      </div>
      <div
        style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}
        data-testid="separator-label-center"
      >
        <Separator style={{ flex: '1' }} />
        <span style={{ 'flex-shrink': '0' }}>Label (center)</span>
        <Separator style={{ flex: '1' }} />
      </div>
      <SeparatorPropsProvider
        value={
          /** Read the provider's current default size. */
          () => ({ size: large() ? 'lg' : 'xs', variant: 'dashed' })
        }
      >
        <Separator data-testid="separator-inherited" />
        <Separator size="md" data-testid="separator-fixed" />
      </SeparatorPropsProvider>
      <button type="button" onClick={toggleSize} data-testid="separator-size-toggle">
        Toggle shared size
      </button>
      <button type="button" onClick={toggleOrientation} data-testid="separator-orientation-toggle">
        Toggle orientation
      </button>
    </div>
  );
}

const meta = {
  title: 'Content/Separator',
  component: SeparatorContractExample,
} satisfies Meta<typeof SeparatorContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
