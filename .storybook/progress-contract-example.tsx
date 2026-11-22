import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Progress, ProgressPropsProvider, useProgress } from '../src';

/** Show an externally owned machine beside controlled and styled examples. */
function ExternalProgress(): JSX.Element {
  const progress = useProgress({ defaultValue: 20 });

  /** Advance the external machine while retaining its mounted range. */
  function advance(): void {
    progress().setValue(80);
  }

  return (
    <Progress.RootProvider value={progress} size="xs" data-testid="progress-external">
      <Progress.Track data-testid="progress-external-track">
        <Progress.Range data-testid="progress-external-range" />
      </Progress.Track>
      <button type="button" data-testid="progress-external-toggle" onClick={advance}>
        Advance external
      </button>
    </Progress.RootProvider>
  );
}

/** Exercise machine values, CSS variants, and reactive Solid defaults. */
export function ProgressContractExample(): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Update controlled progress and inherited CSS size together. */
  function toggleProgress(): void {
    setAdvanced(!advanced());
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '18px', width: '320px', padding: '12px' }}>
        <Progress.Root value={40} data-testid="progress-default">
          <Progress.Label id="progress-contract-label" data-testid="progress-label">
            Uploading
          </Progress.Label>
          <Progress.ValueText data-testid="progress-value" />
          <Progress.Track aria-labelledby="progress-contract-label" data-testid="progress-track">
            <Progress.Range class="consumer-progress-range" data-testid="progress-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={70} size="xs" data-testid="progress-xs">
          <Progress.Track data-testid="progress-xs-track">
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={35} unstyled data-testid="progress-unstyled">
          <Progress.Track data-testid="progress-unstyled-track">
            <Progress.Range data-testid="progress-unstyled-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={70} size="lg" variant="subtle" data-testid="progress-subtle">
          <Progress.Track data-testid="progress-lg-track">
            <Progress.Range data-testid="progress-subtle-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={55} striped animated data-testid="progress-striped">
          <Progress.Track>
            <Progress.Range data-testid="progress-striped-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={null} data-testid="progress-indeterminate">
          <Progress.ValueText data-testid="progress-indeterminate-value" />
          <Progress.Track data-testid="progress-indeterminate-track">
            <Progress.Range data-testid="progress-indeterminate-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={25} orientation="vertical" data-testid="progress-vertical">
          <Progress.Track
            data-testid="progress-vertical-track"
            style={{ height: '80px', width: '12px' }}
          >
            <Progress.Range data-testid="progress-vertical-range" />
          </Progress.Track>
        </Progress.Root>
        <Progress.Root value={60} size={{ base: 'sm', md: 'xl' }}>
          <Progress.Track data-testid="progress-responsive-track">
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <ProgressPropsProvider value={() => ({ size: advanced() ? 'lg' : 'sm' })}>
          <Progress.Root value={advanced() ? 75 : 25} data-testid="progress-reactive">
            <Progress.ValueText data-testid="progress-reactive-value" />
            <Progress.Track data-testid="progress-reactive-track">
              <Progress.Range data-testid="progress-reactive-range" />
            </Progress.Track>
          </Progress.Root>
        </ProgressPropsProvider>
        <button type="button" data-testid="progress-toggle" onClick={toggleProgress}>
          Change progress
        </button>
        <ExternalProgress />
      </div>
    </>
  );
}
