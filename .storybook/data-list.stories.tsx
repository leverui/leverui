import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import * as DataList from '../src/components/data-list';
import { Theme } from '../src/components/theme';
import './data-list-contract.css';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['subtle', 'bold'] as const;
const orientations = ['vertical', 'horizontal'] as const;

/** Show custom content styled by its nearest Data List root. */
function SlotProbe(props: { id: string }): JSX.Element {
  return (
    <div class="data-list-slot-probe" data-testid={props.id}>
      Custom
    </div>
  );
}

/** Show native parts, variants, separators, and reactive Data List defaults. */
function DataListMatrix(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Change inherited orientation and size without remounting roots. */
  function toggleLayout(): void {
    setHorizontal(!horizontal());
  }

  return (
    <>
      <div data-testid="data-list-matrix">
        <DataList.Root data-testid="data-list-default" title="Account details">
          <DataList.Item data-testid="default-item">
            <DataList.ItemLabel data-testid="default-label">Status</DataList.ItemLabel>
            <DataList.ItemValue data-testid="default-value">Active</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        {sizes.map(
          /** Render each size with the same semantic parts. */
          (size) => (
            <DataList.Root size={size} data-testid={`data-list-${size}`}>
              <DataList.Item data-testid={`data-list-${size}-item`}>
                <DataList.ItemLabel>Name</DataList.ItemLabel>
                <DataList.ItemValue>Ada</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          ),
        )}
        {variants.map(
          /** Display both label and value treatments. */
          (variant) => (
            <DataList.Root variant={variant} data-testid={`data-list-${variant}`}>
              <DataList.Item>
                <DataList.ItemLabel data-testid={`data-list-${variant}-label`}>
                  Balance
                </DataList.ItemLabel>
                <DataList.ItemValue data-testid={`data-list-${variant}-value`}>
                  £12,340
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          ),
        )}
        {orientations.map(
          /** Show both item flow directions. */
          (orientation) => (
            <DataList.Root orientation={orientation} data-testid={`data-list-${orientation}`}>
              <DataList.Item data-testid={`data-list-${orientation}-item`}>
                <DataList.ItemLabel data-testid={`data-list-${orientation}-label`}>
                  Role
                </DataList.ItemLabel>
                <DataList.ItemValue>Engineer</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          ),
        )}
        <DataList.Root
          orientation="horizontal"
          class="data-list-divided"
          data-testid="data-list-divided"
        >
          <DataList.Item>
            <DataList.ItemLabel>First</DataList.ItemLabel>
            <DataList.ItemValue>One</DataList.ItemValue>
          </DataList.Item>
          <DataList.Item data-testid="data-list-divided-second">
            <DataList.ItemLabel>Second</DataList.ItemLabel>
            <DataList.ItemValue>Two</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root
          orientation={{ base: 'vertical', md: 'horizontal' }}
          data-testid="data-list-responsive"
        >
          <DataList.Item data-testid="data-list-responsive-item">
            <DataList.ItemLabel>Viewport</DataList.ItemLabel>
            <DataList.ItemValue>Responsive</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root
          size={{ base: 'sm', md: 'lg' }}
          variant={{ base: 'subtle', md: 'bold' }}
          data-testid="data-list-responsive-style"
        >
          <DataList.Item data-testid="data-list-responsive-style-item">
            <DataList.ItemLabel data-testid="data-list-responsive-style-label">
              Level
            </DataList.ItemLabel>
            <DataList.ItemValue>High</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.PropsProvider
          value={{
            orientation: horizontal() ? 'horizontal' : 'vertical',
            size: horizontal() ? 'lg' : 'sm',
          }}
        >
          <DataList.Root data-testid="data-list-reactive">
            <DataList.Item data-testid="data-list-reactive-item">
              <DataList.ItemLabel>Mode</DataList.ItemLabel>
              <DataList.ItemValue>
                Inherited <SlotProbe id="data-list-reactive-slot" />
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
          <DataList.Root orientation="vertical" size="md" data-testid="data-list-fixed">
            <DataList.Item data-testid="data-list-fixed-item">
              <DataList.ItemLabel>Mode</DataList.ItemLabel>
              <DataList.ItemValue>
                Fixed <SlotProbe id="data-list-fixed-slot" />
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </DataList.PropsProvider>
        <DataList.Root unstyled data-testid="data-list-unstyled">
          <DataList.Item unstyled data-testid="data-list-unstyled-item">
            <DataList.ItemLabel unstyled>Plain</DataList.ItemLabel>
            <DataList.ItemValue unstyled>Value</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root id="data-list-css-override">
          <DataList.Item>
            <DataList.ItemLabel data-testid="data-list-css-label">Tinted</DataList.ItemLabel>
            <DataList.ItemValue>Value</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root size="lg" variant="bold" data-testid="data-list-outer">
          <DataList.Item data-testid="data-list-outer-item">
            <DataList.ItemLabel>Group</DataList.ItemLabel>
            <DataList.ItemValue>
              <DataList.Root size="sm" variant="subtle" data-testid="data-list-inner">
                <DataList.Item data-testid="data-list-inner-item">
                  <DataList.ItemLabel>Nested</DataList.ItemLabel>
                  <DataList.ItemValue>
                    Value <SlotProbe id="data-list-inner-slot" />
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <Theme appearance="dark" hasBackground={false}>
          <DataList.Root data-testid="data-list-dark">
            <DataList.Item>
              <DataList.ItemLabel data-testid="data-list-dark-label">Dark</DataList.ItemLabel>
              <DataList.ItemValue>Value</DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </Theme>
        <button type="button" onClick={toggleLayout} data-testid="data-list-toggle">
          Toggle layout
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Data List',
  component: DataListMatrix,
} satisfies Meta<typeof DataListMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
