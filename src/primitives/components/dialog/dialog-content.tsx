import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/dialog';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useDialogContext, useDialogLabelParts } from './use-dialog-context';
import { ChildrenFirst } from '../../utils/children-first';
import { withRenderedLabels } from '../../utils/label-parts';

export type DialogContentState = ContentState;

export type DialogContentBaseProps = PolymorphicProps<'div', DialogContentState>;
export type DialogContentProps = Assign<HTMLProps<'div'>, DialogContentBaseProps>;

/** Render the Dialog content. */
export const DialogContent = (props: DialogContentProps) => {
  const api = useDialogContext();
  const presenceApi = usePresenceContext();
  const labelParts = useDialogLabelParts();
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
