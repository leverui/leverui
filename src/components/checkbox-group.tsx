import { splitProps } from '../primitives/utils/split-props';
import {
  Checkbox as PrimitiveCheckbox,
  type CheckboxGroupProps as PrimitiveGroupProps,
} from '../primitives/components/checkbox';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { CheckboxGroupProps, CheckboxGroupRuntimeProps } from './checkbox-group-props';

export type { CheckboxGroupProps } from './checkbox-group-props';
type IntrinsicElement = keyof JSX.IntrinsicElements;

/** Render a selected native element without generating presentation styles. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Compose the primitive's group state with native DOM attributes and authored CSS. */
function CheckboxGroupImpl(props: CheckboxGroupRuntimeProps): JSX.Element {
  const [local, machine] = splitProps(props, [
    'as',
    'asChild',
    'ref',
    'children',
    'class',
    'className',
    'unstyled',
  ]);
  /** Resolve content after the primitive establishes the group context. */
  function content(): JSX.Element {
    return local.children;
  }

  /** Forward the selected native group element to the consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  /** Render the primitive's group attributes on the selected or caller-owned element. */
  function renderGroup(
    getProps: Parameters<NonNullable<PrimitiveGroupProps['asChild']>>[0],
  ): JSX.Element {
    const attributes = createMemo(
      /** Follow the primitive state, native props, and consumer classes without remounting. */
      () => ({
        ...getProps(),
        class: composeRecipeClassNames('checkbox-group', undefined, local.class, local.className),
        'data-unstyled': local.unstyled ? '' : undefined,
        ref: attachNode,
      }),
    );
    return (
      <>
        {local.asChild ? (
          renderNativeLayoutChild('CheckboxGroup', local.asChild, attributes, content)
        ) : (
          <NativeElement component={local.as ?? 'div'} {...attributes()}>
            {content()}
          </NativeElement>
        )}
      </>
    );
  }

  return <PrimitiveCheckbox.Group {...(machine as PrimitiveGroupProps)} asChild={renderGroup} />;
}

/** Expose native, selected, and caller-owned Checkbox group elements. */
export const CheckboxGroup = CheckboxGroupImpl as <As extends IntrinsicElement = 'div'>(
  props: CheckboxGroupProps<As>,
) => JSX.Element;
