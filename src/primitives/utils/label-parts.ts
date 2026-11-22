import { onCleanup } from 'solid-js';

/** A part that names or describes a surface such as a popover or dialog. */
export type LabelPart = 'title' | 'description';

/** Which of a surface's labelling parts are rendered. */
export interface LabelParts {
  /** Report whether at least one part of this kind is rendered. */
  readonly has: (part: LabelPart) => boolean;
  /** Count a rendered part in, and out again when it unmounts. */
  readonly register: (part: LabelPart) => void;
}

/**
 * Track which labelling parts a surface renders. The surface's state machine assumes a title
 * and a description exist until it can look at the page, so on the server, and before it
 * looks, its content points `aria-labelledby` and `aria-describedby` at elements that may not
 * be there.
 *
 * The count is plain, not a signal: Solid 2 forbids writing reactive state while a component
 * renders, which is when a part counts itself in. It is still current when read, because the
 * content renders its children first (see `ChildrenFirst`), and the content reads it again
 * whenever the surface's state changes, such as on open and close.
 */
export function createLabelParts(): LabelParts {
  const counts: Record<LabelPart, number> = { title: 0, description: 0 };
  return {
    /** Report whether a part of this kind is rendered. */
    has(part) {
      return counts[part] > 0;
    },
    /** Count a rendered part in, and out again when it unmounts. */
    register(part) {
      counts[part] += 1;
      onCleanup(
        /** Count the part out when it unmounts. */
        () => {
          counts[part] -= 1;
        },
      );
    },
  };
}

/** Drop a content element's references to labelling parts that are not rendered. */
export function withRenderedLabels<T extends object>(props: T, parts: LabelParts | undefined) {
  if (!parts) return props;
  return {
    ...props,
    ...(parts.has('title') ? {} : { 'aria-labelledby': undefined }),
    ...(parts.has('description') ? {} : { 'aria-describedby': undefined }),
  };
}
