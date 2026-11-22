import { Progress as PrimitiveProgress } from '../primitives/components/progress';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Accessor, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { ClassValue } from '../utils/class-value';

export interface ProgressNativeRootLocal {
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
}

/** Forward either Progress machine root through one native composition bridge. */
export function renderProgressNativeRoot(
  mode: 'root' | 'provider',
  native: object,
  local: ProgressNativeRootLocal,
  attributes: Accessor<object>,
  classPrefix: 'progress' | 'progress-circle',
  children: Accessor<JSX.Element>,
): JSX.Element {
  const part = mode === 'root' ? PrimitiveProgress.Root : PrimitiveProgress.RootProvider;

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine and native attributes without a style adapter. */
    () => native,
    /** Reflect finite appearance choices for authored CSS. */
    attributes,
    {
      /** Preserve the selected root's ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `${classPrefix}__root`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Keep compound parts beneath the active primitive machine. */
      get children() {
        return children();
      },
      /** Preserve caller-owned or selected native roots. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  // The primitive's root variants share the same native composition contract.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
