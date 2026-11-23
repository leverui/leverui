import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { cx } from '../utils/cx';
import {
  mergeChildProps,
  type ChildAttributes,
  type RenderChild,
} from '../styled-system/child-props';

type Appearance = 'light' | 'dark';
type IntrinsicElement = Extract<keyof JSX.IntrinsicElements, keyof HTMLElementTagNameMap>;
type ThemeStyle = JSX.HTMLAttributes<HTMLElement>['style'];
type ThemeColorPalette =
  'gray' | 'red' | 'orange' | 'green' | 'blue' | 'yellow' | 'teal' | 'purple' | 'pink' | 'cyan';

/** Render a selected native element without the style-object runtime. */
const DynamicElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export interface ThemeProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: IntrinsicElement;
  asChild?: RenderChild | undefined;
  className?: string;
  appearance?: Appearance | undefined;
  hasBackground?: boolean | undefined;
  colorPalette?: ThemeColorPalette | undefined;
}

/** Preserve consumer styles while reflecting an explicit color scheme. */
function mergeThemeStyle(style: ThemeStyle, appearance: Appearance | undefined): ThemeStyle {
  if (!appearance) return style;
  if (typeof style === 'string') return `${style};color-scheme:${appearance}`;
  return { ...style, 'color-scheme': appearance };
}

/** Render a scoped theme element with semantic foreground and background. */
export function Theme(props: ThemeProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'as',
    'asChild',
    'appearance',
    'hasBackground',
    'colorPalette',
    'style',
    'class',
    'className',
    'children',
  ]);

  const attributes = createMemo(
    /** Keep native props, scope attributes, and consumer classes reactive. */
    () => ({
      ...rest,
      class: cx('lui-theme', local.class, local.className),
      'data-lui-theme': '',
      'data-lui-color-mode': local.appearance,
      'data-lui-color-palette': local.colorPalette ?? 'gray',
      'data-lui-no-background': local.hasBackground === false ? '' : undefined,
      style: mergeThemeStyle(local.style, local.appearance),
    }),
  );

  /** Merge a Theme scope into its single child while preserving child events and refs. */
  function renderAsChild(): JSX.Element {
    const renderChild = local.asChild;
    if (!renderChild) throw new Error('Theme asChild renderer is missing.');
    const childParent = createMemo(
      /** Keep child content live without including it in attribute resolution. */
      () => ({ ...attributes(), children: local.children }),
    );
    const defaultChildProps = untrack(
      /** Create one stable proxy whose getters read the current Theme attributes. */
      () => mergeChildProps(childParent),
    );

    /** Combine the Theme scope with optional child attributes. */
    function getChildProps(childProps?: ChildAttributes): ChildAttributes {
      return childProps ? mergeChildProps(childParent, childProps) : defaultChildProps;
    }

    return untrack(
      /** Keep the child element stable when its scope attributes change. */
      () => renderChild(getChildProps),
    );
  }

  return (
    <>
      {local.asChild ? (
        renderAsChild()
      ) : (
        <DynamicElement component={local.as ?? 'div'} {...attributes()}>
          {local.children}
        </DynamicElement>
      )}
    </>
  );
}
