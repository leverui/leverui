import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { radiomarkAttributes } from './radiomark-attributes';
import { readRadiomarkChoices, readRadiomarkPalette } from './radiomark-choices';
import type { RadiomarkProps, RadiomarkRootProps } from './radiomark-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a caller-selected native element without inserting styles. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a visual radio mark with reactive native state hooks. */
function RadiomarkRoot(props: RadiomarkRootProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'children',
    'checked',
    'disabled',
    'size',
    'variant',
    'filled',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const choices = createMemo(
    /** Validate finite presentation choices before binding CSS hooks. */
    () => readRadiomarkChoices(local.size, local.variant, local.filled),
  );

  /** Forward the native element to the caller ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and CSS state hooks current under Solid signals. */
    () => ({
      ...native,
      ...radiomarkAttributes(choices()),
      'data-checked': local.checked ? '' : undefined,
      'data-disabled': local.disabled ? '' : undefined,
      'data-unstyled': local.unstyled ? '' : undefined,
      'data-leverui-color-palette': readRadiomarkPalette(local.colorPalette),
      class: composeRecipeClassNames('radiomark', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );
  const dot = createMemo(
    /** Keep the mark decorative and ignore caller-provided children. */
    () => (local.checked ? <span class="dot leverui-radiomark__dot" /> : null),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Radiomark', local.asChild, attributes, dot)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {dot()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native props and refs for the caller-selected element. */
export const Radiomark = RadiomarkRoot as <As extends IntrinsicElement = 'span'>(
  props: RadiomarkProps<As>,
) => JSX.Element;
