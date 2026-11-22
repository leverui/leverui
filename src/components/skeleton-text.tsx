import { splitProps } from '../primitives/utils/split-props';
import { For, children, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { SkeletonRoot } from './skeleton';
import type { SkeletonTextProps } from './skeleton-props';
import { Stack, type StackProps } from './stack';

/** Render text placeholders in a stack and retain one line when loaded. */
export function SkeletonText(props: SkeletonTextProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'loading',
    'noOfLines',
    'gap',
    'rootProps',
    'ref',
    'children',
    'unstyled',
  ]);
  const loading = createMemo(
    /** Follow the default loading state or an explicit reactive value. */
    () => local.loading ?? true,
  );
  const lineIndexes = createMemo(
    /** Keep the first line keyed while count and loading change. */
    () =>
      Array.from(
        { length: loading() ? (local.noOfLines ?? 3) : 1 },
        /** Identify each visible placeholder line. */
        (_unused, index) => index,
      ),
  );
  const rootProps = createMemo(
    /** Merge live wrapper defaults before spreading them into the Stack. */
    () =>
      mergeProps({ gap: local.gap, ref: local.ref }, local.rootProps ?? {}) as StackProps<'div'>,
  );

  return (
    <Stack<'div'>
      {...rootProps()}
      class={composeRecipeClassNames('skeleton-text', undefined, rootProps().class)}
      data-unstyled={local.unstyled ? '' : undefined}
    >
      <For each={lineIndexes()}>
        {/** Pass remaining native props to every line. */}
        {(index) => {
          const content = children(
            /** Resolve repeatable content in each line's Solid owner. */
            () => {
              const supplied = local.children;
              return typeof supplied === 'function' ? supplied() : supplied;
            },
          );

          return (
            <SkeletonRoot
              loading={loading()}
              unstyled={local.unstyled}
              {...rest}
              class={composeRecipeClassNames('skeleton-text__line', undefined, rest.class)}
              data-last-line={
                loading() && index === (local.noOfLines ?? 3) - 1 && index > 0 ? '' : undefined
              }
            >
              {content()}
            </SkeletonRoot>
          );
        }}
      </For>
    </Stack>
  );
}
