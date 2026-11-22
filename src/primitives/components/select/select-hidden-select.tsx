import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { For, Show, createMemo } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useSelectContext } from './use-select-context';

export type SelectHiddenSelectBaseProps = PolymorphicProps<'select'>;
export type SelectHiddenSelectProps = Assign<HTMLProps<'select'>, SelectHiddenSelectBaseProps>;

/** Render the Select hidden select. */
export const SelectHiddenSelect = (props: SelectHiddenSelectProps) => {
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getHiddenSelectProps(), props);
  const isValueEmpty = createMemo(() => select().value.length === 0);
  const field = useFieldContext();

  return (
    <primitive.select aria-describedby={field?.().ariaDescribedby} {...mergedProps}>
      <Show when={isValueEmpty()}>
        <primitive.option value="" />
      </Show>
      <For keyed={false} each={select().collection.items}>
        {(item) => (
          <primitive.option
            value={select().collection.getItemValue(item()) ?? ''}
            disabled={select().collection.getItemDisabled(item())}
          >
            {select().collection.stringifyItem(item())}
          </primitive.option>
        )}
      </For>
    </primitive.select>
  );
};
