import {
  Skeleton,
  SkeletonCircle,
  SkeletonPropsProvider,
  SkeletonText,
  type SkeletonProps,
} from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<SkeletonProps<'div'>['asChild']>>[0];

/** Record the installed placeholder's native ref. */
function markSkeleton(element: HTMLDivElement): void {
  element.dataset.skeletonRef = element.tagName.toLowerCase();
}

/** Compose a caller-owned element with the installed native placeholder. */
function renderOwnedSkeleton(getProps: GetChildProps): JSX.Element {
  return <div {...getProps()} id="packed-skeleton-owned" />;
}

/** Exercise installed exports, provider defaults, styles, and live content. */
export function PackedSkeleton(): JSX.Element {
  const [loading, setLoading] = createSignal(true);

  /** Reveal content and update inherited CSS appearance. */
  function toggleLoading(): void {
    setLoading(!loading());
  }

  /** Read the installed provider's changing variant default. */
  function readVariantDefaults(): { variant: 'pulse' | 'shine' } {
    return { variant: loading() ? 'pulse' : 'shine' };
  }

  /** Create a separate content element for every loading text line. */
  function renderTextLine(): JSX.Element {
    return <span data-packed-text-child="">Finished text</span>;
  }

  return (
    <>
      <Skeleton id="packed-skeleton" data-custom-skeleton="" ref={markSkeleton} loading={loading()}>
        <span id="packed-skeleton-content">Content ready</span>
      </Skeleton>
      <SkeletonCircle size="10" id="packed-skeleton-circle" />
      <SkeletonText loading={loading()} noOfLines={3} rootProps={{ id: 'packed-skeleton-text' }}>
        {renderTextLine}
      </SkeletonText>
      <SkeletonPropsProvider value={readVariantDefaults}>
        <Skeleton id="packed-skeleton-inherited" style={{ height: 'var(--leverui-sizes-5)' }} />
      </SkeletonPropsProvider>
      <Skeleton asChild={renderOwnedSkeleton} variant="none" />
      <button type="button" id="packed-skeleton-toggle" onClick={toggleLoading}>
        Toggle Skeleton
      </button>
    </>
  );
}
