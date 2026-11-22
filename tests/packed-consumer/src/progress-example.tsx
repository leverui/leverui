import { Progress, ProgressPropsProvider, useProgress } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Record the selected native root delivered through the package. */
function markRoot(element: HTMLElement): void {
  element.dataset.progressRootRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the Progress label wrapper. */
function markParentLabel(element: Element): void {
  (element as HTMLElement).dataset.progressParentLabelRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the caller-owned label element. */
function markOwnedLabel(element: HTMLSpanElement): void {
  element.dataset.progressOwnedLabelRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the Progress track wrapper. */
function markParentTrack(element: Element): void {
  (element as HTMLElement).dataset.progressParentTrackRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the caller-owned track element. */
function markOwnedTrack(element: HTMLDivElement): void {
  element.dataset.progressOwnedTrackRef = element.tagName.toLowerCase();
}

/** Record the native tag selected for the value text part. */
function markValueText(element: HTMLOutputElement): void {
  element.dataset.progressValueTextRef = element.tagName.toLowerCase();
}

/** Exercise a consumer-owned primitive Progress machine. */
function ExternalProgress(): JSX.Element {
  const progress = useProgress({ defaultValue: 20 });

  /** Advance the external machine without replacing its range. */
  function advance(): void {
    progress().setValue(80);
  }

  return (
    <Progress.RootProvider value={progress} id="packed-progress-external">
      <Progress.Track id="packed-progress-external-track">
        <Progress.Range id="packed-progress-external-range" />
      </Progress.Track>
      <button type="button" id="packed-progress-external-toggle" onClick={advance}>
        Advance external
      </button>
    </Progress.RootProvider>
  );
}

/** Exercise installed parts, merged refs, and changing provider defaults. */
export function PackedProgress(): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Update value and inherited CSS size on the mounted machine. */
  function advance(): void {
    setAdvanced(!advanced());
  }

  return (
    <>
      <ProgressPropsProvider value={() => ({ size: advanced() ? 'lg' : 'sm' })}>
        <Progress.Root
          as="section"
          id="packed-progress"
          ref={markRoot}
          value={advanced() ? 75 : 25}
          colorPalette="teal"
        >
          <Progress.Label
            ref={markParentLabel}
            asChild={
              /** Merge the installed label props into a caller-owned span. */
              (getProps) => (
                <span {...getProps({ ref: markOwnedLabel })} id="packed-progress-label">
                  Uploading
                </span>
              )
            }
          />
          <Progress.ValueText as="output" ref={markValueText} id="packed-progress-value" />
          <Progress.Track
            id="packed-progress-track"
            aria-labelledby="packed-progress-label"
            data-progress-track-owner="consumer"
            ref={markParentTrack}
            asChild={
              /** Merge the installed track props into a caller-owned div. */
              (getProps) => <div {...getProps({ ref: markOwnedTrack })} />
            }
          >
            <Progress.Range id="packed-progress-range" />
          </Progress.Track>
        </Progress.Root>
      </ProgressPropsProvider>
      <button type="button" id="packed-progress-toggle" onClick={advance}>
        Change progress
      </button>
      <ExternalProgress />
    </>
  );
}
