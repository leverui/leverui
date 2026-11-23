import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Timeline, type TimelineRootBaseProps } from '../src/components/timeline-exports';

/** Render a consumer-owned element with the public title part hook. */
function TimelineTitleProbe(): JSX.Element {
  return (
    <span class="lui-timeline__title" data-testid="timeline-style-probe">
      Custom title
    </span>
  );
}

/** Exercise native parts, roles, refs, events, and reactive provider defaults. */
export function TimelineMainExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [showLine, setShowLine] = createSignal(false);
  const [actions, setActions] = createSignal(0);

  /** Supply changing appearance defaults to the main Timeline. */
  function readDefaults(): TimelineRootBaseProps {
    return { size: large() ? 'xl' : 'sm', showLastSeparator: showLine() };
  }

  /** Record the native div passed to the public root ref. */
  function captureRoot(element: HTMLDivElement): void {
    element.dataset.timelineRef = element.tagName.toLowerCase();
  }

  /** Change the inherited size without remounting the events. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change whether the final connector remains visible. */
  function toggleLastLine(): void {
    setShowLine(!showLine());
  }

  /** Record activation of a button inside event content. */
  function recordAction(): void {
    setActions(actions() + 1);
  }

  return (
    <>
      <Timeline.RootPropsProvider value={readDefaults}>
        <Timeline.Root
          class="consumer-timeline"
          colorPalette="blue"
          ref={captureRoot}
          data-testid="timeline-root"
        >
          <Timeline.Item data-testid="timeline-first-item">
            <Timeline.Connector data-testid="timeline-first-connector">
              <Timeline.Separator data-testid="timeline-first-separator" />
              <Timeline.Indicator data-testid="timeline-first-indicator">1</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content data-testid="timeline-first-content">
              <Timeline.Title data-testid="timeline-first-title">Order placed</Timeline.Title>
              <Timeline.Description data-testid="timeline-description">
                Yesterday
              </Timeline.Description>
              <TimelineTitleProbe />
              <button type="button" onClick={recordAction} data-testid="timeline-action">
                View order
              </button>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item data-testid="timeline-last-item">
            <Timeline.Connector>
              <Timeline.Separator data-testid="timeline-last-separator" />
              <Timeline.Indicator data-testid="timeline-last-indicator">2</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title>Order shipped</Timeline.Title>
              <Timeline.Description>Today</Timeline.Description>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      </Timeline.RootPropsProvider>
      <button type="button" onClick={toggleSize} data-testid="timeline-size-toggle">
        Toggle size
      </button>
      <button type="button" onClick={toggleLastLine} data-testid="timeline-line-toggle">
        Toggle last separator
      </button>
      <output data-testid="timeline-actions">{actions()}</output>
    </>
  );
}
