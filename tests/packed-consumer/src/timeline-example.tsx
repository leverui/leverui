import { Timeline, type TimelineRootBaseProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Timeline semantics, appearance updates, and consumer CSS. */
export function PackedTimeline(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [showLine, setShowLine] = createSignal(false);
  const [actions, setActions] = createSignal(0);

  /** Read current defaults for the installed Timeline root. */
  function readDefaults(): TimelineRootBaseProps {
    return { size: large() ? 'xl' : 'sm', showLastSeparator: showLine() };
  }

  /** Record the actual native element passed to the root ref. */
  function captureRoot(element: HTMLDivElement): void {
    element.dataset.packedTimelineRef = element.tagName.toLowerCase();
  }

  /** Change inherited marker size on existing elements. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Change the last separator's display. */
  function toggleLine(): void {
    setShowLine(!showLine());
  }

  /** Record a native button activation inside event content. */
  function recordAction(): void {
    setActions(actions() + 1);
  }

  return (
    <section>
      <Timeline.RootPropsProvider value={readDefaults}>
        <Timeline.Root id="packed-timeline" colorPalette="blue" ref={captureRoot}>
          <Timeline.Item id="packed-timeline-first">
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator id="packed-timeline-indicator">1</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title id="packed-timeline-title">Order placed</Timeline.Title>
              <Timeline.Description>Yesterday</Timeline.Description>
              <button type="button" id="packed-timeline-action" onClick={recordAction}>
                View order
              </button>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item id="packed-timeline-last">
            <Timeline.Connector>
              <Timeline.Separator id="packed-timeline-last-separator" />
              <Timeline.Indicator>2</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title>Order shipped</Timeline.Title>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      </Timeline.RootPropsProvider>
      <button type="button" id="packed-timeline-size-toggle" onClick={toggleSize}>
        Change Timeline size
      </button>
      <button type="button" id="packed-timeline-line-toggle" onClick={toggleLine}>
        Show last separator
      </button>
      <output id="packed-timeline-actions">{actions()}</output>
      <div class="packed-timeline-css">
        <Timeline.Root>
          <Timeline.Item>
            <Timeline.Content>
              <Timeline.Title id="packed-timeline-css-title">Consumer CSS</Timeline.Title>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      </div>
    </section>
  );
}
