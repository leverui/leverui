import { type JSX } from '@solidjs/web';
import { Button, ButtonGroup, ScrollArea, Stack, useScrollArea } from '../../src';
import { ExampleParagraphs } from './example-paragraphs';
import './scroll-area-surfaces.css';

/** Scroll the viewport to a fixed vertical position. */
export function ScrollAreaScrollToPosition(): JSX.Element {
  const scrollArea = useScrollArea();

  /** Move the viewport to the source example's target position. */
  function scrollToPosition(): void {
    scrollArea().scrollTo({ top: 200, behavior: 'smooth' });
  }

  return (
    <Stack gap="8" align="flex-start" class="scroll-area-example-controls">
      <Button variant="outline" size="sm" onClick={scrollToPosition}>
        Scroll to 200px
      </Button>
      <ScrollArea.RootProvider value={scrollArea} class="scroll-area-example-control-root">
        <ScrollArea.Viewport>
          <ScrollArea.Content class="scroll-area-example-gutter">
            <ExampleParagraphs paragraphs={3} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.RootProvider>
    </Stack>
  );
}

/** Scroll to the upper and lower edges through an external machine. */
export function ScrollAreaScrollToSide(): JSX.Element {
  const scrollArea = useScrollArea();

  /** Move to the lower edge. */
  function scrollToBottom(): void {
    scrollArea().scrollToEdge({ edge: 'bottom', behavior: 'smooth' });
  }

  /** Return to the upper edge. */
  function scrollToTop(): void {
    scrollArea().scrollToEdge({ edge: 'top', behavior: 'smooth' });
  }

  return (
    <Stack gap="8" align="flex-start" class="scroll-area-example-controls">
      <ButtonGroup variant="outline" justify="center" size="sm">
        <Button onClick={scrollToBottom}>Scroll to bottom</Button>
        <Button onClick={scrollToTop}>Scroll to top</Button>
      </ButtonGroup>
      <ScrollArea.RootProvider value={scrollArea} class="scroll-area-example-control-root">
        <ScrollArea.Viewport>
          <ScrollArea.Content class="scroll-area-example-gutter">
            <ExampleParagraphs paragraphs={3} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.RootProvider>
    </Stack>
  );
}
