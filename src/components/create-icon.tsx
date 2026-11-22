import { untrack } from 'solid-js';
import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { IconRoot, type IconProps } from './icon';

export interface CreateIconOptions {
  /** Native SVG viewBox; defaults to `0 0 24 24`. */
  viewBox?: string;
  /** Render fresh SVG content for each Icon instance. */
  path?: () => JSX.Element;
  /** Single-path data used when `path` is absent or renders no content. */
  d?: string;
  /** Name exposed on the returned component for developer tools. */
  displayName?: string | undefined;
  /** Overridable defaults passed to every Icon instance. */
  defaultProps?: IconProps<'svg'>;
}

export interface CreatedIcon {
  /** Render a reusable SVG with instance props after its configured defaults. */
  (props: IconProps<'svg'>): JSX.Element;
  displayName?: string | undefined;
}

/** Check whether a Solid child value contains content beyond empty placeholders. */
function hasRenderablePath(value: unknown): boolean {
  if (value == null || typeof value === 'boolean') return false;
  if (Array.isArray(value)) return value.some(hasRenderablePath);
  return true;
}

/** Use fresh custom SVG children or the single-path fallback. */
function renderIconPath(options: CreateIconOptions): JSX.Element {
  const path = options.path?.();
  return hasRenderablePath(path) ? path : <path fill="currentColor" d={options.d} />;
}

/** Create a reusable Solid Icon with fresh SVG children per mount. */
export function createIcon(options: CreateIconOptions): CreatedIcon {
  /** Apply the caller's live props after configured defaults. */
  function CreatedIcon(props: IconProps<'svg'>): JSX.Element {
    const path = renderIconPath(options);
    const merged = mergeProps(
      { viewBox: options.viewBox ?? '0 0 24 24' },
      options.defaultProps,
      props,
    );
    const [local, native] = splitProps(merged, ['ref']);

    /** Forward the caller's SVG ref after validating the created root. */
    function attachCreated(element: Element): void {
      if (!(element instanceof SVGSVGElement)) {
        throw new TypeError('createIcon must render a native SVG root.');
      }
      untrack(() => local.ref)?.(element);
    }

    return (
      <IconRoot {...native} ref={attachCreated}>
        {path}
      </IconRoot>
    );
  }

  CreatedIcon.displayName = options.displayName;
  return CreatedIcon;
}
