import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { SegmentGroup, type SegmentGroupItemData } from '../src';

/** Exercise generated JSX labels and inherited size updates on one machine. */
function DynamicSegments(): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);
  const [large, setLarge] = createSignal(false);

  /** Keep the convenience item collection reactive without replacing the root. */
  function items(): Array<string | SegmentGroupItemData> {
    return expanded()
      ? [
          { value: 'React', label: 'React', disabled: true },
          {
            value: 'Solid',
            label: (
              <>
                <span aria-hidden="true">◇</span> Solid
              </>
            ),
          },
          'Vue',
        ]
      : [
          'React',
          {
            value: 'Solid',
            label: (
              <>
                <span aria-hidden="true">◆</span> Solid
              </>
            ),
          },
        ];
  }

  /** Replace generated options while retaining the selected value. */
  function toggleItems(): void {
    setExpanded(!expanded());
  }

  /** Change inherited size without remounting the root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Read the inherited size without replacing the group. */
  function appearanceDefaults(): { size: 'lg' | 'xs' } {
    return { size: large() ? 'lg' : 'xs' };
  }

  return (
    <>
      <SegmentGroup.PropsProvider value={appearanceDefaults}>
        <form data-testid="segment-dynamic-form">
          <SegmentGroup.Root
            name="framework"
            aria-label="Dynamic framework"
            defaultValue="Solid"
            data-testid="segment-dynamic-root"
          >
            <SegmentGroup.Indicator data-testid="segment-dynamic-indicator" />
            <SegmentGroup.Items items={items()} />
          </SegmentGroup.Root>
        </form>
      </SegmentGroup.PropsProvider>
      <button type="button" onClick={toggleItems} data-testid="segment-toggle-items">
        Toggle items
      </button>
      <button type="button" onClick={toggleSize} data-testid="segment-toggle-size">
        Toggle size
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Segment Group Family Dynamic',
  component: DynamicSegments,
} satisfies Meta<typeof DynamicSegments>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Dynamic: Story = { render: DynamicSegments };
