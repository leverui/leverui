import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/popover';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { usePopoverContext, usePopoverLabelParts } from './use-popover-context';
import { ChildrenFirst } from '../../utils/children-first';
import { withRenderedLabels } from '../../utils/label-parts';

export type PopoverContentState = ContentState;

export type PopoverContentBaseProps = PolymorphicProps<'div', PopoverContentState>;
export type PopoverContentProps = Assign<HTMLProps<'div'>, PopoverContentBaseProps>;

/** Render the Popover content. */
export const PopoverContent = (props: PopoverContentProps) => {
  const api = usePopoverContext();
  const presenceApi = usePresenceContext();
  const labelParts = usePopoverLabelParts();
  const mergedProps = mergeProps(
    () => withRenderedLabels(api().getContentProps(), labelParts),
    () => presenceApi().presenceProps,
    props,
  );

  return (
    <Show when={!presenceApi().unmounted}>
      <ChildrenFirst content={props.children}>
        {
          /** Render the content once its title and description, if any, are counted. */
          (content) => (
            <primitive.div
              {...mergedProps}
              ref={composeRefGetters(
                () => presenceApi().ref,
                () => props.ref,
              )}
              state={api().getContentState()}
            >
              {content()}
            </primitive.div>
          )
        }
      </ChildrenFirst>
    </Show>
  );
};
