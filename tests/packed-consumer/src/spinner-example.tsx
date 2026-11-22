import { Spinner, SpinnerPropsProvider, type SpinnerProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<SpinnerProps['asChild']>>[0];

/** Record the selected native div supplied through Spinner's public ref. */
function markDiv(element: HTMLDivElement): void {
  element.dataset.refTag = 'div';
}

/** Render a consumer-owned indicator with Spinner's live attributes. */
function renderChild(getProps: GetChildProps): JSX.Element {
  return (
    <span {...getProps()} id="packed-spinner-child">
      ◌
    </span>
  );
}

/** Exercise installed Spinner defaults, responsiveness, CSS, and composition. */
export function PackedSpinner(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change provider size while its descendants stay mounted. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <div>
      <Spinner id="packed-spinner-default" />
      <Spinner id="packed-spinner-responsive" size={{ base: 'sm', md: 'xl' }} />
      <SpinnerPropsProvider value={{ size: large() ? 'lg' : 'xs', class: 'provider-spinner' }}>
        <Spinner id="packed-spinner-inherited" class="instance-spinner" />
        <Spinner id="packed-spinner-fixed" size="sm" />
      </SpinnerPropsProvider>
      <Spinner
        id="packed-spinner-custom"
        class="packed-spinner-custom"
        role="status"
        aria-label="Loading results"
      />
      <Spinner as="div" ref={markDiv} id="packed-spinner-div" />
      <Spinner asChild={renderChild} />
      <button id="packed-spinner-toggle" type="button" onClick={toggleSize}>
        Change Spinner size
      </button>
    </div>
  );
}
