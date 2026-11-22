import { createMemo, untrack, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { mergeRefs } from '../merge-refs';
import type { RenderSvgChild, SvgChildAttributes, SvgChildProps } from './svg-child-props';

/** Render a caller-owned SVG with live native attributes and glyph content. */
export function renderNativeSvgChild(
  family: string,
  renderer: RenderSvgChild | undefined,
  attributes: Accessor<SvgChildProps>,
  content: Accessor<JSX.Element>,
): JSX.Element {
  if (!renderer) throw new Error(`${family} asChild renderer is missing.`);
  const parent = createMemo(
    /** Keep SVG attributes and glyphs reactive under the child renderer. */
    () => ({ ...attributes(), children: content() }),
  );
  const defaultProps = untrack(
    /** Create one stable proxy for callers that spread child props once. */
    () => mergeProps(parent),
  );

  /** Merge the child SVG's attributes and ref with the current parent. */
  function getChildProps(overrides?: SvgChildAttributes): SvgChildProps {
    if (!overrides) return defaultProps;
    return mergeProps(parent, overrides, {
      ref: mergeRefs(attributes().ref, overrides.ref),
    });
  }

  return untrack(
    /** Preserve the caller-owned SVG while its state or size changes. */
    () => renderer(getChildProps),
  );
}
