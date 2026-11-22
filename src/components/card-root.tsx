import { splitProps } from '../primitives/utils/split-props';
import { children, createComponent, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { readResponsiveStrings } from '../styled-system/responsive-values';
import { CardContextProvider } from './card-context';
import type { NativeElementTag } from './native-element-props';
import { useCardProps, type CardRootProps, type CardRootRuntimeProps } from './card-props';

/** Render the selected native Card tag without inserted presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Reject choices that have no authored Card selector. */
function readCardChoices(
  value: unknown,
  allowed: readonly string[],
  name: string,
): ReturnType<typeof readResponsiveStrings> {
  const choices = readResponsiveStrings(value);
  if (choices === undefined || Object.values(choices).some((choice) => !allowed.includes(choice))) {
    throw new Error(`Card ${name} must use a supported value at each breakpoint.`);
  }
  return choices;
}

/** Render Card with finite selectors and native consumer attributes. */
function CardRootComponent(props: CardRootRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children', 'asChild']);
  const merged = useCardProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'size',
    'variant',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const sizes = createMemo(
    /** Keep responsive size choices reactive without producing CSS. */
    () => readCardChoices(local.size, ['sm', 'md', 'lg'], 'size'),
  );
  const variants = createMemo(
    /** Keep responsive surface choices reactive without producing CSS. */
    () => readCardChoices(local.variant, ['elevated', 'outline', 'subtle'], 'variant'),
  );

  /** Forward the native root node to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Bind ordinary breakpoints and consumer attributes to one native root. */
    () => ({
      ...native,
      'data-size': sizes()?.base ?? 'md',
      'data-size-sm': sizes()?.sm,
      'data-size-md': sizes()?.md,
      'data-size-lg': sizes()?.lg,
      'data-size-xl': sizes()?.xl,
      'data-size-2xl': sizes()?.['2xl'],
      'data-variant': variants()?.base ?? 'outline',
      'data-variant-sm': variants()?.sm,
      'data-variant-md': variants()?.md,
      'data-variant-lg': variants()?.lg,
      'data-variant-xl': variants()?.xl,
      'data-variant-2xl': variants()?.['2xl'],
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('card__root', 'leverui-card', local.class, local.className),
      ref: attachNode,
    }),
  );
  /** Render a caller-owned or selected native root. */
  function renderRoot(): JSX.Element {
    const content = children(
      /** Keep parts mounted as root choices change. */
      () => contentProps.children,
    );
    return (
      <>
        {contentProps.asChild ? (
          renderNativeLayoutChild('CardRoot', contentProps.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return createComponent(CardContextProvider, {
    /** Share the live root presentation choice with descendant parts. */
    value: () => Boolean(local.unstyled),
    /** Mount parts under their nearest Card root. */
    get children() {
      return renderRoot();
    },
  });
}

/** Expose native, selected-tag, and caller-owned Card roots. */
export const CardRoot = CardRootComponent as <As extends NativeElementTag = 'div'>(
  props: CardRootProps<As>,
) => JSX.Element;
