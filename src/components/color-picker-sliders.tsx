import { splitProps } from '../primitives/utils/split-props';
import { primitive, type PolymorphicProps } from '../primitives/components/factory';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import { useColorPickerAppearance } from './color-picker-appearance';
import { ColorPickerChannelSlider } from './color-picker-parts-area';

export type ColorPickerSlidersProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { unstyled?: boolean }, As>;

type RuntimeProps = JSX.HTMLAttributes<HTMLDivElement> & {
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
};

/** Group the hue and alpha controls with authored spacing. */
function ColorPickerSlidersImpl(props: RuntimeProps): JSX.Element {
  const appearance = useColorPickerAppearance();
  const [local, rest] = splitProps(props, [
    'as',
    'asChild',
    'unstyled',
    'class',
    'className',
    'ref',
    'children',
  ]);

  /** Forward the selected native element's ref through the primitive. */
  function readRef(): unknown {
    return local.ref;
  }

  /** Follow a caller-selected native element without changing the slider context. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  const nativeProps = mergeProps(
    /** Keep caller-native attributes and style reactive. */
    () => rest,
    {
      /** Gate authored spacing when the root or part is unstyled. */
      get 'data-lui-color-picker-css'() {
        return appearance.unstyled() || local.unstyled ? undefined : '';
      },
      /** Expose unstyled to consumer CSS. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Keep the convenience composite's public class hook. */
      get class() {
        return composeRecipeClassNames(
          'color-picker__sliders',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Preserve a caller-provided native ref. */
      get ref() {
        return local.ref;
      },
      /** Preserve polymorphism through the primitive's child renderer. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <primitive.div {...nativeProps}>
      {local.children === undefined ? (
        <>
          <ColorPickerChannelSlider channel="hue" />
          <ColorPickerChannelSlider channel="alpha" />
        </>
      ) : (
        local.children
      )}
    </primitive.div>
  );
}

/** Expose native element selection on the convenience slider group. */
export const ColorPickerSliders = ColorPickerSlidersImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerSlidersProps<As>,
) => JSX.Element;
