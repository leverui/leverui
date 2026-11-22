import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useSelectContext } from './use-select-context';

export type SelectPositionerBaseProps = PolymorphicProps<'div'>;
export type SelectPositionerProps = Assign<HTMLProps<'div'>, SelectPositionerBaseProps>;

/** Render the Select positioner. */
export const SelectPositioner = (props: SelectPositionerProps) => {
  const select = useSelectContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => select().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
