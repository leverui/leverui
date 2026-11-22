import { splitProps } from '../primitives/utils/split-props';
import { ColorPicker as PrimitiveColorPicker } from '../primitives/components/color-picker';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { GetChildProps } from '../styled-system/child-props';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { ButtonProps } from './button';
import type { ComponentIntrinsicElement } from './component-element-props';
import {
  colorPickerAppearanceAttributes,
  useColorPickerAppearance,
} from './color-picker-appearance';
import type { NativeElementTag } from './native-element-props';
import { IconButton } from './icon-button';
import { Loader } from './loader';

export type ColorPickerEyeDropperTriggerProps<As extends NativeElementTag = 'button'> =
  ButtonProps<As>;
type RuntimeTriggerProps = ColorPickerEyeDropperTriggerProps & {
  as?: NativeElementTag | undefined;
};

/** Give the primitive's EyeDropper action the icon-button presentation. */
function ColorPickerEyeDropperTriggerImpl(props: RuntimeTriggerProps): JSX.Element {
  const appearance = useColorPickerAppearance();
  const [local, rest] = splitProps(props, [
    'as',
    'asChild',
    'ref',
    'class',
    'className',
    'unstyled',
    'loading',
    'loadingText',
    'spinner',
    'spinnerPlacement',
    'children',
  ]);

  /** Render the selected element while the primitive keeps its machine action. */
  function renderPrimitive(getButtonProps: GetChildProps): JSX.Element {
    /** Follow the caller's selected native element. */
    function readTag(): ComponentIntrinsicElement {
      return local.as ?? 'button';
    }

    /** Forward the caller's native element ref. */
    function readRef(): unknown {
      return local.ref;
    }

    const primitiveProps = mergeProps(
      /** Keep native button props live under the primitive's event merger. */
      () => getButtonProps(),
      {
        /** Attach a ref when the primitive renders its own native button. */
        get ref() {
          return local.as || local.asChild ? undefined : local.ref;
        },
        /** Preserve polymorphism through the primitive's child renderer. */
        get asChild() {
          if (local.asChild) {
            return primitiveChildWithRef(
              local.asChild as NonNullable<PolymorphicProps<'button'>['asChild']>,
              readRef,
            );
          }
          return local.as ? primitiveAsChild<'button'>(readTag, readRef) : undefined;
        },
      },
    );
    return createComponent(
      PrimitiveColorPicker.EyeDropperTrigger as Component<typeof primitiveProps>,
      primitiveProps,
    );
  }

  /** Keep the public part hook and caller classes reactive. */
  function readClass(): string {
    return composeRecipeClassNames(
      'color-picker__eyeDropperTrigger',
      undefined,
      local.class,
      local.className,
    );
  }

  return (
    <IconButton
      {...rest}
      {...colorPickerAppearanceAttributes(appearance)}
      data-leverui-color-picker-css={appearance.unstyled() || local.unstyled ? undefined : ''}
      data-unstyled={appearance.unstyled() || local.unstyled ? '' : undefined}
      unstyled={appearance.unstyled() || local.unstyled}
      loading={local.loading}
      class={readClass()}
      asChild={renderPrimitive}
    >
      {local.loading && !local.asChild ? (
        <Loader
          spinner={local.spinner}
          text={local.loadingText}
          spinnerPlacement={local.spinnerPlacement}
        >
          {local.children}
        </Loader>
      ) : (
        local.children
      )}
    </IconButton>
  );
}

/** Expose the direct trigger with icon-button props and native selection. */
export const ColorPickerEyeDropperTrigger = ColorPickerEyeDropperTriggerImpl as <
  As extends NativeElementTag = 'button',
>(
  props: ColorPickerEyeDropperTriggerProps<As>,
) => JSX.Element;
