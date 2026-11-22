import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useGroupItemBinding } from './group-item-binding';
import type { GroupSkip } from './group-items';
import { groupLayoutAttributes, groupLayoutStyle, type GroupLayoutOptions } from './group-layout';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

interface GroupOptions extends GroupLayoutOptions {
  /** Exclude a rendered native child from joined edges and stacking. */
  skip?: GroupSkip | undefined;
  unstyled?: boolean | undefined;
}

type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  GroupOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render one native Group tag without a styling runtime. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

export type GroupProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  GroupOptions,
  As
>;

type DistributiveOmit<Value, Omitted extends PropertyKey> = Value extends unknown
  ? Omit<Value, Omitted>
  : never;

/** Reuse Group's native contract when a composition owns selected options. */
export type GroupPropsWithOmitted<
  As extends NativeElementTag,
  Omitted extends PropertyKey,
> = DistributiveOmit<GroupProps<As>, Omitted>;

/** Render indexed Group items with authored layout and joined-edge states. */
function GroupRoot(props: RuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'children',
    'as',
    'asChild',
    'orientation',
    'attached',
    'grow',
    'stacking',
    'align',
    'justify',
    'wrap',
    'skip',
    'unstyled',
    'class',
    'ref',
  ]);
  const bindItems = useGroupItemBinding(
    /** Read the latest Solid skip predicate when children change. */
    () => local.skip,
  );
  const content = children(
    /** Keep child ownership stable while Group choices change. */
    () => local.children,
  );

  /** Read children for the native or caller-owned root. */
  function readContent(): JSX.Element {
    return content();
  }

  /** Bind the mounted root and forward it to the consumer. */
  function attachNode(element: Element): void {
    if (!(element instanceof HTMLElement)) throw new Error('Group requires an HTML root.');
    bindItems(element);
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Follow native attributes, choices, and layout variables reactively. */
    () => ({
      ...native,
      ...groupLayoutAttributes(local),
      style: groupLayoutStyle(local, native.style),
      class: composeRecipeClassNames('group', undefined, local.class),
      'data-unstyled': local.unstyled ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('Group', local.asChild, attributes, readContent)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind native props, selected tags, and refs to the Group element. */
export const Group = GroupRoot as <As extends NativeElementTag = 'div'>(
  props: GroupProps<As>,
) => JSX.Element;
