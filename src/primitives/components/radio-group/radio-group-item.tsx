import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRadioGroupContext } from './use-radio-group-context';
import { RadioGroupItemProvider } from './use-radio-group-item-context';
import { RadioGroupItemPropsProvider } from './use-radio-group-item-props-context';

export type RadioGroupItemState = ItemState;

export type RadioGroupItemBaseProps = ItemProps & PolymorphicProps<'label', RadioGroupItemState>;
export type RadioGroupItemProps = Assign<HTMLProps<'label'>, RadioGroupItemBaseProps>;

/** Render the RadioGroup item. */
export const RadioGroupItem = (props: RadioGroupItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'value',
    'disabled',
    'invalid',
  ]);
  const radioGroup = useRadioGroupContext();
  const mergedProps = mergeProps(() => radioGroup().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => radioGroup().getItemState(itemProps));

  return (
    <RadioGroupItemPropsProvider value={itemProps}>
      <RadioGroupItemProvider value={itemState}>
        <primitive.label {...mergedProps} state={radioGroup().getItemState(itemProps)} />
      </RadioGroupItemProvider>
    </RadioGroupItemPropsProvider>
  );
};
