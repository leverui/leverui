import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { containerVariantAttributes } from './container-layout';
import {
  useContainerProps,
  type ContainerRootProps,
  type ContainerBaseProps,
} from './container-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export type ContainerProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  ContainerBaseProps,
  As
>;

/** Render the selected HTML element without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Constrain native or caller-owned content through authored CSS. */
function ContainerRoot(props: ContainerRootProps): JSX.Element {
  const [own, instance] = splitProps(props, ['children']);
  const content = children(
    /** Keep mounted children stable as provider defaults change. */
    () => own.children,
  );
  const merged = useContainerProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'asChild',
    'centerContent',
    'fluid',
    'unstyled',
    'class',
    'ref',
  ]);

  /** Read content through either rendering path. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Forward the selected element to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native attributes and inherited variants reactive. */
    () => ({
      ...native,
      ...containerVariantAttributes(local),
      class: composeRecipeClassNames('container', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Container', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned Container props. */
export const Container = ContainerRoot as <As extends NativeElementTag = 'div'>(
  props: ContainerProps<As>,
) => JSX.Element;
