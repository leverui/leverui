import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import type { GetChildProps } from '../styled-system/child-props';
import { Circle } from './circle';
import { SkeletonRoot } from './skeleton';
import type { SkeletonCircleProps, SkeletonRootProps } from './skeleton-props';
import type { SquareSizeOptions } from './square-size';

/** Compose Circle geometry with a Skeleton on the same native element. */
function SkeletonCircleRoot(props: SkeletonRootProps & SquareSizeOptions): JSX.Element {
  const [local, rest] = splitProps(props, ['size', 'ref']);

  /** Render the caller's placeholder as Circle's styled child. */
  function renderCircleChild(getProps: GetChildProps): JSX.Element {
    return (
      <SkeletonRoot
        {...rest}
        {...getProps({ class: rest.class, children: rest.children })}
        ref={local.ref}
      />
    );
  }

  return <Circle size={local.size} asChild={renderCircleChild} />;
}

/** Preserve the selected Skeleton element and ref with circular geometry. */
export const SkeletonCircle = SkeletonCircleRoot as <
  As extends keyof JSX.IntrinsicElements = 'div',
>(
  props: SkeletonCircleProps<As>,
) => JSX.Element;
