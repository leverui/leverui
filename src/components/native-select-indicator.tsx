import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementTag } from './native-element-props';
import type {
  NativeSelectIndicatorBaseProps,
  NativeSelectIndicatorProps,
} from './native-select-props';
import { useNativeSelectState } from './native-select-state';

type RuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  keyof NativeSelectIndicatorBaseProps | 'ref'
> &
  NativeSelectIndicatorBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render a selected native indicator without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a decorative chevron unless the caller supplies content. */
function NativeSelectIndicatorImpl(props: RuntimeProps): JSX.Element {
  const state = useNativeSelectState();
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'unstyled',
    'children',
    'class',
    'className',
    'ref',
  ]);
  const attributes = createMemo(
    /** Keep native attributes and root-owned state reactive. */
    () => ({
      ...native,
      'data-disabled': state.disabled() ? '' : undefined,
      'data-invalid': state.invalid() ? '' : undefined,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(
        'native-select__indicator',
        undefined,
        local.class,
        local.className,
      ),
      ref: local.ref,
    }),
  );
  const content = createMemo(
    /** Preserve a caller replacement or expose the native chevron. */
    () =>
      local.children ?? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      ),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('NativeSelectIndicator', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind selected native tag and ref types in the public signature. */
export const NativeSelectIndicator = NativeSelectIndicatorImpl as <
  As extends NativeElementTag = 'div',
>(
  props: NativeSelectIndicatorProps<As>,
) => JSX.Element;
