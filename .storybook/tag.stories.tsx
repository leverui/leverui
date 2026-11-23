import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import * as Avatar from '../src/components/avatar';
import { Tag } from '../src/components/tag-exports';
import { type TagRootBaseProps, type TagRootProps } from '../src/components/tag-props';

type GetTagChildProps = Parameters<NonNullable<TagRootProps['asChild']>>[0];

/** Exercise Tag parts, variants, close events, and Solid child rendering. */
function TagContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [closes, setCloses] = createSignal(0);
  const [actions, setActions] = createSignal(0);

  /** Read current appearance defaults when a descendant Tag updates. */
  function readDefaults(): TagRootBaseProps {
    return { size: large() ? 'xl' : 'sm' };
  }

  /** Mark the native root received through its ref. */
  function markTag(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Update inherited size without remounting Tag parts. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Count close-button activations. */
  function closeTag(): void {
    setCloses(closes() + 1);
  }

  /** Count native clicks from a consumer-owned button. */
  function recordAction(): void {
    setActions(actions() + 1);
  }

  /** Place Tag styles on a consumer-owned native button. */
  function renderButton(getProps: GetTagChildProps): JSX.Element {
    return <button {...getProps()} type="button" data-testid="tag-as-button" />;
  }

  return (
    <>
      <Tag.RootPropsProvider value={readDefaults}>
        <Tag.Root
          ref={markTag}
          colorPalette="blue"
          style={{ 'max-width': '180px' }}
          data-testid="tag-parts-root"
        >
          <Tag.StartElement data-testid="tag-start">
            <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
            </svg>
          </Tag.StartElement>
          <Tag.Label data-testid="tag-label">
            A long label that should stop after one visible line
          </Tag.Label>
          <span class="lui-tag__label" data-testid="tag-style-probe">
            Custom label
          </span>
          <Tag.EndElement data-testid="tag-end">
            <Tag.CloseTrigger onClick={closeTag} data-testid="tag-close" />
          </Tag.EndElement>
        </Tag.Root>
      </Tag.RootPropsProvider>
      <button type="button" onClick={toggleSize} data-testid="tag-size-toggle">
        Toggle size
      </button>
      <output data-testid="tag-closes">{closes()}</output>

      <div data-testid="tag-variants">
        <Tag.Root variant="subtle" colorPalette="red" size="sm" data-testid="tag-subtle">
          <Tag.Label>Subtle</Tag.Label>
        </Tag.Root>
        <Tag.Root variant="solid" colorPalette="blue" size="md" data-testid="tag-solid">
          <Tag.Label>Solid</Tag.Label>
        </Tag.Root>
        <Tag.Root variant="outline" colorPalette="green" size="lg" data-testid="tag-outline">
          <Tag.Label>Outline</Tag.Label>
        </Tag.Root>
        <Tag.Root variant="surface" colorPalette="orange" size="xl" data-testid="tag-surface">
          <Tag.Label>Surface</Tag.Label>
        </Tag.Root>
      </div>

      <Tag.Root size={{ base: 'sm', md: 'xl' }} data-testid="tag-responsive-root">
        <Tag.Label data-testid="tag-responsive-label">Responsive</Tag.Label>
      </Tag.Root>
      <Tag.Root
        variant={{ base: 'subtle', md: 'solid' }}
        colorPalette="blue"
        data-testid="tag-responsive-variant"
      >
        <Tag.Label>Responsive treatment</Tag.Label>
      </Tag.Root>

      <Tag.Root style={{ 'max-width': '130px' }} data-testid="tag-overflow-root">
        <Tag.Label data-testid="tag-overflow-label">
          A very long category label that must be truncated with an ellipsis
        </Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger data-testid="tag-overflow-close" />
        </Tag.EndElement>
      </Tag.Root>

      <Tag.Root size="sm" style={{ 'border-radius': '9999px' }} data-testid="tag-avatar-small-root">
        <Tag.StartElement data-testid="tag-avatar-small-start">
          <Avatar.Root size="full">
            <Avatar.Fallback name="John Doe" />
          </Avatar.Root>
        </Tag.StartElement>
        <Tag.Label>Small avatar</Tag.Label>
      </Tag.Root>
      <Tag.Root size="xl" style={{ 'border-radius': '9999px' }} data-testid="tag-avatar-xl-root">
        <Tag.StartElement data-testid="tag-avatar-xl-start">
          <Avatar.Root size="full">
            <Avatar.Fallback name="John Doe" />
          </Avatar.Root>
        </Tag.StartElement>
        <Tag.Label>Large avatar</Tag.Label>
      </Tag.Root>

      <Tag.Root asChild={renderButton} onClick={recordAction} variant="solid">
        <Tag.Label>Tag action</Tag.Label>
      </Tag.Root>
      <output data-testid="tag-actions">{actions()}</output>
    </>
  );
}

const meta = {
  title: 'Content/Tag',
  component: TagContractExample,
} satisfies Meta<typeof TagContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
