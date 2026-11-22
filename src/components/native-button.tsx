import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { buttonAttributes } from './button-attributes';
import { buttonContent } from './button-content';
import type { ButtonRootProps } from './button-props';
import type { NativeElementTag } from './native-element-props';

/** Render a selected native tag without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Reject unsupported object styling props before they reach the native element. */
function assertNativeButtonProps(attributes: JSX.HTMLAttributes<HTMLElement>): void {
  for (const [name, value] of Object.entries(attributes)) {
    if ((name === 'css' || name === 'recipe') && value !== undefined) {
      throw new TypeError(`Button ${name} is unsupported; use native class and style.`);
    }
  }
}

/** Render the default Button through stable attributes and authored CSS. */
export function NativeButton(props: ButtonRootProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'loading',
    'loadingText',
    'spinner',
    'spinnerPlacement',
    'type',
    'as',
    'asChild',
    'children',
  ]);
  const nativeAttributes = native as JSX.HTMLAttributes<HTMLElement>;
  const attributes = createMemo(
    /** Keep HTML attributes, loading state, and CSS selectors reactive. */
    () => {
      assertNativeButtonProps(nativeAttributes);
      return {
        ...nativeAttributes,
        type: local.type ?? 'button',
        disabled: Boolean(local.loading || native.disabled),
        'data-loading': local.loading ? '' : undefined,
        ...buttonAttributes(local),
        'data-unstyled': local.unstyled ? '' : undefined,
        class: composeRecipeClassNames('button', undefined, local.class, local.className),
      };
    },
  );

  /** Read live content for native and caller-owned child paths. */
  function readContent(): JSX.Element {
    return buttonContent(local);
  }

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Button', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'button'} {...attributes()}>
          {readContent()}
        </NativeElement>
      )}
    </>
  );
}
