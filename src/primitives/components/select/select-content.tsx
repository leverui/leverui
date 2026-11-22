import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useSelectContext } from './use-select-context';

export type SelectContentState = ContentState;

export type SelectContentBaseProps = PolymorphicProps<'div', SelectContentState>;
export type SelectContentProps = Assign<HTMLProps<'div'>, SelectContentBaseProps>;

/** Render the Select content. */
export const SelectContent = (props: SelectContentProps) => {
  const select = useSelectContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => select().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  );

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presenceApi().ref,
          () => props.ref,
        )}
        state={select().getContentState()}
      />
    </Show>
  );
};
