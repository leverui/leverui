import { parseDate } from '@internationalized/date';
import { For, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Build a primitive-backed month grid from the public low-level parts. */
function ManualMonthGrid(): JSX.Element {
  const picker = DatePicker.useDatePickerContext();

  /** Confirm the public RangeText ref points to its native div. */
  function captureRange(element: HTMLDivElement): void {
    element.dataset.rangeRef = element.tagName;
  }

  return (
    <DatePicker.View view="month">
      <DatePicker.RangeText ref={captureRange} data-testid="date-picker-manual-range" />
      <DatePicker.Table columns={4} data-testid="date-picker-manual-table">
        <DatePicker.TableBody>
          <For each={picker().getMonthsGrid({ columns: 4, format: 'short' })}>
            {
              /** Keep each machine month row within the four-column grid. */
              (months) => (
                <DatePicker.TableRow>
                  <For each={months}>
                    {
                      /** Bind a month label to its selectable value. */
                      (month) => (
                        <DatePicker.TableCell value={month.value} columns={4}>
                          <DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
                        </DatePicker.TableCell>
                      )
                    }
                  </For>
                </DatePicker.TableRow>
              )
            }
          </For>
        </DatePicker.TableBody>
      </DatePicker.Table>
    </DatePicker.View>
  );
}

/** Exercise machine column props without multicolumn CSS side effects. */
function ManualDatePickerStory(): JSX.Element {
  return (
    <>
      <DatePicker.Root inline defaultView="month" defaultFocusedValue={parseDate('2026-03-14')}>
        <ManualMonthGrid />
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Composition',
  component: ManualDatePickerStory,
} satisfies Meta<typeof ManualDatePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Manual: Story = { render: ManualDatePickerStory };

/** Own a date machine outside RootProvider while defaults stay reactive. */
function ExternalDatePicker(): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const picker = DatePicker.useDatePicker({ defaultValue: [parseDate('2026-03-14')] });

  /** Switch provider defaults without reconstructing the date machine. */
  function changeSize(): void {
    setSize('lg');
  }

  /** Supply the current finite size to the caller-owned machine root. */
  function readDefaults(): { size: 'sm' | 'lg' } {
    return { size: size() };
  }

  /** Render the primitive's root props on a caller-owned section element. */
  const renderRoot: NonNullable<DatePicker.RootProviderProps['asChild']> = (getProps) => (
    <section {...getProps()} data-testid="date-picker-external-root" />
  );

  /** Confirm the external root ref reaches the section element. */
  function captureRoot(element: Element): void {
    element.setAttribute('data-root-ref', 'attached');
  }

  return (
    <>
      <button type="button" onClick={changeSize}>
        Increase picker size
      </button>
      <DatePicker.PropsProvider value={readDefaults}>
        <DatePicker.RootProvider value={picker} asChild={renderRoot} ref={captureRoot}>
          <DatePicker.Label>External date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input htmlTranslate="no" data-testid="date-picker-external-input" />
          </DatePicker.Control>
          <DatePicker.Context>
            {
              /** Expose the same machine's selected date for browser checks. */
              (api) => (
                <output data-testid="date-picker-external-value">{api().valueAsString}</output>
              )
            }
          </DatePicker.Context>
        </DatePicker.RootProvider>
      </DatePicker.PropsProvider>
    </>
  );
}

/** Keep locale and style contexts around an externally owned date machine. */
function ExternalDatePickerStory(): JSX.Element {
  return (
    <>
      <ExternalDatePicker />
    </>
  );
}

export const External: Story = { render: ExternalDatePickerStory };
