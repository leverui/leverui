import { Icon, IconPropsProvider, createIcon, type IconProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetIconChildProps = Parameters<NonNullable<IconProps<'svg'>['asChild']>>[0];
const PackedSquare = createIcon({ d: 'M3 3h18v18H3z', displayName: 'PackedSquare' });

/** Leave custom SVG content empty to exercise the installed factory fallback. */
function renderEmptyPath(): null {
  return null;
}

const PackedFallback = createIcon({ path: renderEmptyPath, d: 'M1 1h2v2H1z' });

/** Give each Icon a fresh SVG path from component defaults. */
function renderSharedPath(): JSX.Element {
  return <path d="M5 5h14v14H5z" />;
}

/** Render a consumer-owned SVG through the published Icon child contract. */
function renderPackedSvg(getProps: GetIconChildProps): JSX.Element {
  return (
    <svg {...getProps()} viewBox="0 0 32 32" id="packed-icon-child">
      <circle cx="16" cy="16" r="10" fill="currentColor" />
    </svg>
  );
}

/** Exercise published Icon types, authored CSS, SVG composition, and live defaults. */
export function PackedIcon(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited size without remounting the native SVG. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <div>
      <IconPropsProvider value={{ size: large() ? 'lg' : 'xs', title: 'Packed shared icon' }}>
        <Icon id="packed-icon-inherited" viewBox="0 0 24 24">
          <path d="M2 2h20v20H2z" />
        </Icon>
        <Icon id="packed-icon-fixed" size="sm" />
      </IconPropsProvider>
      <Icon asChild={renderPackedSvg} size="lg" />
      <IconPropsProvider value={{ as: 'span', title: 'Packed tag' }}>
        <Icon id="packed-icon-provider-as" />
        <Icon as="svg" id="packed-icon-provider-as-override" />
      </IconPropsProvider>
      <IconPropsProvider value={{ children: renderSharedPath }}>
        <Icon id="packed-icon-shared-first" />
        <Icon id="packed-icon-shared-second" />
      </IconPropsProvider>
      <PackedFallback id="packed-icon-fallback" />
      <PackedSquare
        id="packed-icon-created"
        class="packed-icon-custom-size"
        size="xl"
        aria-hidden="false"
        role="img"
        aria-label="Square"
      />
      <button type="button" id="packed-icon-toggle" onClick={toggleSize}>
        Toggle packed Icon size
      </button>
    </div>
  );
}
