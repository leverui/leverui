import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import {
  radioGroupPartComponents,
  radioGroupPartTags,
  type RadioGroupPartSlot,
} from './radio-group-part-registry';
import { useRadioGroupPresentation } from './radio-group-presentation';
import { radiomarkAttributes } from './radiomark-attributes';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = {
  children?: JSX.Element | undefined;
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  as?: keyof JSX.IntrinsicElements | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  ref?: unknown | undefined;
};

export interface RadioGroupPartInput<Props extends RuntimePartProps> {
  slot: RadioGroupPartSlot;
  props: Props;
}

/** Render one primitive Radio Group part with native props and authored CSS hooks. */
export function renderRadioGroupPart<Props extends RuntimePartProps>(
  input: RadioGroupPartInput<Props>,
): JSX.Element {
  const { slot, props } = input;
  const runtime: Props & RuntimePartProps = props;
  const part = radioGroupPartComponents[slot];
  const presentation = useRadioGroupPresentation();
  const [content, local, native] = splitProps(
    runtime,
    ['children'],
    ['unstyled', 'class', 'className', 'as', 'asChild', 'ref'],
  );

  /** Follow the caller's selected native part tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? radioGroupPartTags[slot];
  }

  /** Forward a caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve the primitive's machine props and changing native attributes. */
    () => native,
    /** Bind shared Radiomark choices on the visible control only. */
    () =>
      slot === 'itemControl'
        ? radiomarkAttributes({ ...presentation().choices, filled: { base: false } })
        : {},
    {
      /** Compose the public part hook with the shared visual mark hook. */
      get class() {
        return composeRecipeClassNames(
          `radio-group__${slot}`,
          undefined,
          slot === 'itemControl' ? 'lui-radiomark' : undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored CSS without changing the primitive's state contract. */
      get 'data-unstyled'() {
        return presentation().unstyled || local.unstyled ? '' : undefined;
      },
      /** Forward the ref to the primitive's native or caller-owned element. */
      get ref() {
        return local.ref;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
    content,
  );

  // The primitive declares each slot separately; the registry binds this slot to its props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
