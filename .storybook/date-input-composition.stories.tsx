import { parseDate } from '@internationalized/date';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DateInput } from '../src';

/** Clear the nearest date machine through its public context accessor. */
function ClearButton(): JSX.Element {
  const machine = DateInput.useDateInputContext();

  /** Remove the selected value from visible and native form controls. */
  function clearDate(): void {
    machine().clearValue();
  }

  return (
    <button type="button" onClick={clearDate}>
      Clear date
    </button>
  );
}

/** Keep the primitive behavior on a caller-rendered segment group and custom root. */
function CustomDateInputStory(): JSX.Element {
  /** Confirm the native root ref reaches the caller's selected section. */
  function captureRoot(element: HTMLElement): void {
    element.setAttribute('data-root-ref', 'attached');
  }

  /** Confirm the segment-group ref reaches the caller's own element. */
  function captureGroup(element: Element): void {
    element.setAttribute('data-group-ref', 'attached');
  }

  /** Render the primitive's live group props on a caller-owned native div. */
  const renderGroup: NonNullable<DateInput.SegmentsProps['asChild']> = (getProps) => (
    <div {...getProps()} data-testid="date-input-custom-segments" />
  );

  return (
    <>
      <DateInput.Root
        as="section"
        ref={captureRoot}
        defaultValue={[parseDate('2026-03-14')]}
        data-testid="date-input-custom-root"
      >
        <DateInput.Label>Custom date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments asChild={renderGroup} ref={captureGroup} htmlTranslate="no" />
          <ClearButton />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-custom-hidden" />
      </DateInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/DateInput/Composition',
  component: CustomDateInputStory,
} satisfies Meta<typeof CustomDateInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Custom: Story = { render: CustomDateInputStory };

/** Build segment positions manually from the public machine context. */
function ManualDateSegments(): JSX.Element {
  const machine = DateInput.useDateInputContext();
  return (
    <DateInput.SegmentGroup index={0} data-testid="date-input-manual-segments">
      <For keyed={false} each={machine().getSegments({ index: 0 })}>
        {
          /** Keep each editable and literal segment tied to its machine index. */
          (segment) => <DateInput.Segment segment={segment()} />
        }
      </For>
    </DateInput.SegmentGroup>
  );
}

/** Expose lower-level SegmentGroup and Segment composition. */
function ManualDateInputStory(): JSX.Element {
  return (
    <>
      <DateInput.Root defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Manual date</DateInput.Label>
        <DateInput.Control>
          <ManualDateSegments />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-manual-hidden" />
      </DateInput.Root>
    </>
  );
}

export const Manual: Story = { render: ManualDateInputStory };
