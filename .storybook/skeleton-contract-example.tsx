import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Skeleton, SkeletonCircle, SkeletonPropsProvider, SkeletonText, Theme } from '../src';

/** Show placeholder variants, composition, CSS hooks, and live transitions. */
export function SkeletonContractExample(): JSX.Element {
  const [loading, setLoading] = createSignal(true);
  const [shine, setShine] = createSignal(false);
  const blockStyle = { width: '100px', height: '20px' };

  /** Reveal content and switch provider styling without replacing roots. */
  function toggleSkeleton(): void {
    setLoading(!loading());
    setShine(!shine());
  }

  /** Supply a live variant default to the inherited placeholder. */
  function readVariantDefaults(): { variant: 'pulse' | 'shine' } {
    return { variant: shine() ? 'shine' : 'pulse' };
  }

  /** Create one hidden custom child for each loading text line. */
  function renderProviderTextLine(): JSX.Element {
    return <span data-testid="skeleton-provider-text-child">Retained content</span>;
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '18px', padding: '20px', width: '350px' }}>
        <Skeleton style={blockStyle} data-testid="skeleton-pulse" />
        <Skeleton
          variant="shine"
          style={{
            ...blockStyle,
            '--lui-skeleton-start-color': '#ff0080',
            '--lui-skeleton-end-color': '#ffaa00',
          }}
          data-testid="skeleton-shine"
        />
        <Skeleton variant="none" style={blockStyle} data-testid="skeleton-none" />
        <Skeleton
          variant={{ base: 'pulse', md: 'shine' }}
          style={blockStyle}
          data-testid="skeleton-responsive"
        />
        <Skeleton loading={false} data-testid="skeleton-loaded">
          <span data-testid="skeleton-loaded-child">Loaded content</span>
        </Skeleton>
        <Skeleton loading={true} data-testid="skeleton-hidden">
          <span data-testid="skeleton-hidden-child">Hidden content</span>
        </Skeleton>
        <SkeletonCircle size="10" data-testid="skeleton-circle" />
        <SkeletonText
          noOfLines={3}
          gap="4"
          loading={loading()}
          rootProps={{ title: 'skeleton-text-root', class: 'custom-text-stack' }}
        >
          Finished text
        </SkeletonText>
        <Skeleton loading={loading()} data-testid="skeleton-reactive">
          <span data-testid="skeleton-reactive-child">Ready</span>
        </Skeleton>
        <SkeletonPropsProvider value={readVariantDefaults}>
          <Skeleton style={blockStyle} data-testid="skeleton-inherited" />
        </SkeletonPropsProvider>
        <SkeletonPropsProvider value={{ loading: false, variant: 'shine' }}>
          <SkeletonText noOfLines={2} rootProps={{ title: 'skeleton-provider-text' }}>
            {renderProviderTextLine}
          </SkeletonText>
        </SkeletonPropsProvider>
        <Theme appearance="dark" hasBackground={false}>
          <Skeleton style={blockStyle} data-testid="skeleton-dark" />
        </Theme>
        <button type="button" onClick={toggleSkeleton} data-testid="skeleton-toggle">
          Toggle Skeleton
        </button>
      </div>
    </>
  );
}
