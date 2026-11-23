import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { radioCardAttributes } from './radio-card-attributes';
import { radioCardMarkVariants } from './radio-card-choices';
import {
  radioCardPartComponents,
  radioCardPartTags,
  type RadioCardPartSlot,
} from './radio-card-part-registry';
import { useRadioCardPresentation } from './radio-card-presentation';
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

export interface RadioCardPartInput<Props extends RuntimePartProps> {
  slot: RadioCardPartSlot;
  props: Props;
}

/** Render one primitive Card part with native props and authored CSS hooks. */
export function renderRadioCardPart<Props extends RuntimePartProps>(
  input: RadioCardPartInput<Props>,
): JSX.Element {
  const { slot, props } = input;
  const runtime: Props & RuntimePartProps = props;
  const part = radioCardPartComponents[slot];
  const presentation = useRadioCardPresentation();
  const [content, local, native] = splitProps(
    runtime,
    ['children'],
    ['unstyled', 'class', 'className', 'as', 'asChild', 'ref'],
  );

  /** Follow the caller's selected native part tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? radioCardPartTags[slot];
  }

  /** Forward the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve changing native and machine attributes. */
    () => native,
    /** Put finite Card selections on items and shared mark choices on indicators. */
    () => {
      const choices = presentation().choices;
      if (slot === 'item') return radioCardAttributes(choices);
      if (slot === 'itemIndicator') {
        return radiomarkAttributes({
          size: choices.size,
          variant: radioCardMarkVariants(choices.variant),
          filled: { base: false },
        });
      }
      return {};
    },
    {
      /** Compose the public part hook with the shared visual mark hook. */
      get class() {
        return composeRecipeClassNames(
          `radio-card__${slot}`,
          undefined,
          slot === 'itemIndicator' ? 'lui-radiomark' : undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored CSS without changing the primitive's behavior. */
      get 'data-unstyled'() {
        return presentation().unstyled || local.unstyled ? '' : undefined;
      },
      /** Forward a caller ref to the native or caller-owned part. */
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
