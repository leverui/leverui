import { splitProps } from '../primitives/utils/split-props';
import { useCheckboxContext } from '../primitives/components/checkbox';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type {
  CheckboxCardAddonProps,
  CheckboxCardContentProps,
  CheckboxCardDescriptionProps,
} from './checkbox-card-part-props';
import { useCheckboxCardPresentation } from './checkbox-card-presentation';

type CardDivPartName = 'content' | 'addon' | 'description';
type CardDivProps = CheckboxCardContentProps & { part: CardDivPartName };
type CardDivAttributes = JSX.HTMLAttributes<HTMLDivElement> & {
  [name: `data-${string}`]: string | undefined;
};

/** Render a Card-only div without narrowing its caller-owned ref. */
const NativeElement = Dynamic as (props: { component: 'div' } & CardDivAttributes) => JSX.Element;

/** Render a native Card-only part beneath the nearest primitive machine. */
function CardDivPart(props: CardDivProps): JSX.Element {
  const checkbox = useCheckboxContext();
  const presentation = useCheckboxCardPresentation();
  const [local, native] = splitProps(props, [
    'part',
    'unstyled',
    'class',
    'className',
    'asChild',
    'ref',
    'children',
  ]);

  /** Forward the native div or caller-owned child to a parent callback ref. */
  function attachNode(element: HTMLElement): void {
    const ref = local.ref;
    if (typeof ref === 'function') ref(element as HTMLDivElement);
  }

  const attributes = createMemo(
    /** Follow native props, machine state, and CSS hooks without remounting. */
    (): CardDivAttributes => ({
      ...native,
      [`data-checkbox-card-${local.part}`]: '',
      'data-disabled': checkbox().disabled ? '' : undefined,
      'data-state':
        local.part === 'description' ? (checkbox().checked ? 'checked' : 'unchecked') : undefined,
      'data-unstyled': presentation().unstyled || local.unstyled ? '' : undefined,
      class: composeRecipeClassNames(
        `checkbox-card__${local.part}`,
        undefined,
        local.class,
        local.className,
      ),
      ref: attachNode,
    }),
  );

  /** Resolve caller content after the primitive establishes the Checkbox context. */
  function content(): JSX.Element {
    return local.children;
  }

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'CheckboxCard',
          local.asChild,
          // The caller-owned element receives the same native div event contract.
          attributes as () => JSX.HTMLAttributes<HTMLElement>,
          content,
        )
      ) : (
        <NativeElement component="div" {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Arrange the label and description within a Checkbox Card. */
export function CheckboxCardContent(props: CheckboxCardContentProps): JSX.Element {
  return <CardDivPart {...props} part="content" />;
}

/** Render descriptive text with the current Checkbox machine state. */
export function CheckboxCardDescription(props: CheckboxCardDescriptionProps): JSX.Element {
  return <CardDivPart {...props} part="description" />;
}

/** Render supplementary card content below the main control. */
export function CheckboxCardAddon(props: CheckboxCardAddonProps): JSX.Element {
  return <CardDivPart {...props} part="addon" />;
}
