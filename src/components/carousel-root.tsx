import { splitProps } from '../primitives/utils/split-props';
import { Carousel as PrimitiveCarousel } from '../primitives/components/carousel';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { CarouselAppearanceProvider, type CarouselAppearanceState } from './carousel-appearance';
import type { UseCarouselReturn } from './carousel-machine';
import {
  useCarouselRootProps,
  useCarouselRootProviderProps,
  type CarouselRootProps,
  type CarouselRootProviderProps,
} from './carousel-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  spacing?: string | undefined;
  children?: JSX.Element | undefined;
};
type RuntimeRootProviderProps = RuntimeRootProps & { value: UseCarouselReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeRootProviderProps };

/** Bind native attributes and the unstyled scope to either primitive root mode. */
function renderCarouselRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveCarousel.Root : PrimitiveCarousel.RootProvider;
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const appearance: CarouselAppearanceState = {
    /** Keep descendant presentation in sync with the root. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine and native attributes without a style adapter. */
    () => native,
    {
      /** Keep the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('carousel__root', undefined, local.class, local.className);
      },
      /** Suppress authored presentation without changing slide behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep compound parts beneath the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected native roots. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <CarouselAppearanceProvider value={appearance}>
      {/* The primitive's two root signatures meet at this native adapter. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </CarouselAppearanceProvider>
  );
}

/** Render a Carousel with its own primitive and Zag machine. */
function CarouselRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCarouselRootProps(instance);
  const rootProps = mergeProps({ spacing: '1rem' }, merged);
  return renderCarouselRoot({ mode: 'root', props: rootProps }, content);
}

/** Expose a typed Carousel root with caller-owned element selection. */
export const CarouselRoot = CarouselRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: CarouselRootProps<As>,
) => JSX.Element;

/** Render a Carousel driven by a caller-owned primitive machine accessor. */
function CarouselRootProviderImpl(props: RuntimeRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCarouselRootProviderProps(instance);
  return renderCarouselRoot({ mode: 'provider', props: merged }, content);
}

/** Require an external Carousel machine accessor. */
export const CarouselRootProvider = CarouselRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: CarouselRootProviderProps<As>,
) => JSX.Element;
