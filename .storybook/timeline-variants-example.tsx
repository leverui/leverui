import { type JSX } from '@solidjs/web';
import { Timeline } from '../src/components/timeline-exports';

/** Show the four marker variants and a responsive indicator size. */
export function TimelineVariantsExample(): JSX.Element {
  return (
    <>
      <div data-testid="timeline-variants">
        <Timeline.Root variant="subtle" size="sm" data-testid="timeline-subtle">
          <Timeline.Item>
            <Timeline.Indicator>1</Timeline.Indicator>
          </Timeline.Item>
        </Timeline.Root>
        <Timeline.Root variant="solid" size="md" data-testid="timeline-solid">
          <Timeline.Item>
            <Timeline.Indicator>1</Timeline.Indicator>
          </Timeline.Item>
        </Timeline.Root>
        <Timeline.Root variant="outline" size="lg" data-testid="timeline-outline">
          <Timeline.Item>
            <Timeline.Indicator>1</Timeline.Indicator>
          </Timeline.Item>
        </Timeline.Root>
        <Timeline.Root variant="plain" size="xl" data-testid="timeline-plain">
          <Timeline.Item>
            <Timeline.Indicator>1</Timeline.Indicator>
          </Timeline.Item>
        </Timeline.Root>
      </div>
      <Timeline.Root size={{ base: 'sm', md: 'xl' }} data-testid="timeline-responsive">
        <Timeline.Item>
          <Timeline.Indicator data-testid="timeline-responsive-indicator">1</Timeline.Indicator>
        </Timeline.Item>
      </Timeline.Root>
      <Timeline.Root
        variant={{ base: 'solid', md: 'outline' }}
        showLastSeparator={{ base: false, md: true }}
        data-testid="timeline-responsive-treatment"
      >
        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator data-testid="timeline-responsive-treatment-indicator">
              1
            </Timeline.Indicator>
          </Timeline.Connector>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Separator data-testid="timeline-responsive-last-separator" />
            <Timeline.Indicator>2</Timeline.Indicator>
          </Timeline.Connector>
        </Timeline.Item>
      </Timeline.Root>
    </>
  );
}
