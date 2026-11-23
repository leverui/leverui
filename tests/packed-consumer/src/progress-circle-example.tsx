import { ProgressCircle, ProgressCirclePropsProvider, useProgress } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Record the native SVG delivered through the installed package. */
function markCircle(element: SVGSVGElement): void {
  element.dataset.circleRef = element.tagName.toLowerCase();
}

/** Exercise an external primitive/Zag machine through installed Circle parts. */
function ExternalCircle(): JSX.Element {
  const progress = useProgress({ defaultValue: 20 });

  /** Advance the externally owned machine without replacing its SVG. */
  function advance(): void {
    progress().setValue(80);
  }

  return (
    <ProgressCircle.RootProvider value={progress} size="xs">
      <ProgressCircle.Circle id="packed-circle-external">
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <button type="button" id="packed-circle-external-toggle" onClick={advance}>
        Advance external
      </button>
    </ProgressCircle.RootProvider>
  );
}

/** Exercise installed SVG parts, refs, CSS variables, and reactive defaults. */
export function PackedProgressCircle(): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Update value and inherited size on the mounted machine. */
  function advance(): void {
    setAdvanced(!advanced());
  }

  /** Supply reactive Circle sizing through the installed provider API. */
  function readCircleDefaults(): { size: 'lg' | 'sm' } {
    return { size: advanced() ? 'lg' : 'sm' };
  }

  return (
    <>
      <ProgressCirclePropsProvider value={readCircleDefaults}>
        <ProgressCircle.Root
          value={advanced() ? 75 : 25}
          style={{ '--lui-progress-circle-thickness': '9px' }}
          colorPalette="teal"
        >
          <ProgressCircle.Label id="packed-circle-label">Uploading</ProgressCircle.Label>
          <ProgressCircle.Circle
            id="packed-circle-svg"
            ref={markCircle}
            aria-labelledby="packed-circle-label"
          >
            <ProgressCircle.Track id="packed-circle-track" />
            <ProgressCircle.Range id="packed-circle-range" strokeLinecap="round" />
          </ProgressCircle.Circle>
          <ProgressCircle.ValueText as="output" id="packed-circle-value" />
        </ProgressCircle.Root>
      </ProgressCirclePropsProvider>
      <button type="button" id="packed-circle-toggle" onClick={advance}>
        Change circle
      </button>
      <ExternalCircle />
    </>
  );
}
