import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import './progress-circle-contract.css';
import { AbsoluteCenter, ProgressCircle, ProgressCirclePropsProvider, useProgress } from '../src';

/** Show an externally owned machine with the Circle presentation. */
function ExternalCircle(): JSX.Element {
  const progress = useProgress({ defaultValue: 20 });

  /** Advance the external machine without replacing its SVG. */
  function advance(): void {
    progress().setValue(80);
  }

  return (
    <ProgressCircle.RootProvider value={progress} size="xs">
      <ProgressCircle.Circle data-testid="circle-external">
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <button type="button" data-testid="circle-external-toggle" onClick={advance}>
        Advance external
      </button>
    </ProgressCircle.RootProvider>
  );
}

/** Exercise Circle values, SVG geometry, styling, and Solid updates. */
export function ProgressCircleContractExample(): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Change controlled progress and inherited CSS size together. */
  function toggleCircle(): void {
    setAdvanced(!advanced());
  }

  /** Follow the live example state when supplying Circle defaults. */
  function readCircleDefaults(): { size: 'lg' | 'sm' } {
    return { size: advanced() ? 'lg' : 'sm' };
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '18px', padding: '12px' }}>
        <ProgressCircle.Root value={40} data-testid="circle-default-root">
          <ProgressCircle.Label id="circle-contract-label">Uploading</ProgressCircle.Label>
          <ProgressCircle.Circle
            aria-labelledby="circle-contract-label"
            data-testid="circle-default"
          >
            <ProgressCircle.Track data-testid="circle-default-track" />
            <ProgressCircle.Range
              class="consumer-circle-range"
              data-testid="circle-default-range"
            />
          </ProgressCircle.Circle>
          <ProgressCircle.ValueText data-testid="circle-default-value" />
        </ProgressCircle.Root>
        <ProgressCircle.Root value={70} size="xs">
          <ProgressCircle.Circle data-testid="circle-xs">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCircle.Root value={35} unstyled>
          <ProgressCircle.Circle data-testid="circle-unstyled">
            <ProgressCircle.Track data-testid="circle-unstyled-track" />
            <ProgressCircle.Range data-testid="circle-unstyled-range" />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCircle.Root value={70} size="xl" colorPalette="red">
          <ProgressCircle.Circle data-testid="circle-xl">
            <ProgressCircle.Track />
            <ProgressCircle.Range data-testid="circle-red-range" strokeLinecap="round" />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCircle.Root value={null}>
          <ProgressCircle.Circle data-testid="circle-indeterminate">
            <ProgressCircle.Track />
            <ProgressCircle.Range data-testid="circle-indeterminate-range" />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCircle.Root value={60} size={{ base: 'sm', md: 'xl' }}>
          <ProgressCircle.Circle data-testid="circle-responsive">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCircle.Root value={50} style={{ '--leverui-progress-circle-thickness': '10px' }}>
          <ProgressCircle.Circle data-testid="circle-thick">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <div>
          <ProgressCircle.Root value={75} size="lg">
            <ProgressCircle.Circle aria-label="Uploading files" data-testid="circle-centered">
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <AbsoluteCenter data-testid="circle-centered-value-host">
              <ProgressCircle.ValueText data-testid="circle-centered-value" />
            </AbsoluteCenter>
          </ProgressCircle.Root>
        </div>
        <ProgressCircle.Root value={null}>
          <ProgressCircle.Circle aria-label="Loading files">
            <ProgressCircle.Track />
            <ProgressCircle.Range
              data-testid="circle-custom-indeterminate-range"
              class="consumer-circle-indeterminate"
            />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <ProgressCirclePropsProvider value={readCircleDefaults}>
          <ProgressCircle.Root value={advanced() ? 75 : 25}>
            <ProgressCircle.Circle data-testid="circle-reactive">
              <ProgressCircle.Track />
              <ProgressCircle.Range data-testid="circle-reactive-range" />
            </ProgressCircle.Circle>
            <ProgressCircle.ValueText data-testid="circle-reactive-value" />
          </ProgressCircle.Root>
        </ProgressCirclePropsProvider>
        <button type="button" data-testid="circle-toggle" onClick={toggleCircle}>
          Change circle
        </button>
        <ExternalCircle />
      </div>
    </>
  );
}
