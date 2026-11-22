import { type FocusTrapOptions, trapFocus } from '@zag-js/focus-trap';
import { createEffect } from 'solid-js';
import type { Assign } from '../../types';
import { composeRefGetters } from '../../utils/compose-refs';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';

export interface TrapOptions extends Pick<
  FocusTrapOptions,
  | 'onActivate'
  | 'onDeactivate'
  | 'initialFocus'
  | 'fallbackFocus'
  | 'returnFocusOnDeactivate'
  | 'setReturnFocus'
  | 'persistentElements'
> {
  /**
   * Whether the focus trap is disabled.
   */
  disabled?: boolean;
}

export type FocusTrapBaseProps = PolymorphicProps<'div'> & TrapOptions;

export type FocusTrapProps = Assign<HTMLProps<'div'>, FocusTrapBaseProps>;

/** Render the FocusTrap root. */
export const FocusTrap = (props: FocusTrapProps) => {
  let localNode!: HTMLDivElement;

  const [trapProps, localProps] = createSplitProps<TrapOptions>()(props, [
    'disabled',
    'onActivate',
    'onDeactivate',
    'initialFocus',
    'fallbackFocus',
    'returnFocusOnDeactivate',
    'setReturnFocus',
    'persistentElements',
  ]);

  createEffect(
    () => (trapProps.disabled ? undefined : { ...trapProps }),
    (options) => {
      if (!localNode || !options) return;
      const autoFocusNode = localNode.querySelector<HTMLElement>('[autofocus], [data-autofocus]');
      return trapFocus(localNode, {
        ...options,
        initialFocus: options.initialFocus || (autoFocusNode ?? undefined),
      });
    },
  );

  return (
    <primitive.div
      {...localProps}
      ref={composeRefGetters(
        () => (el) => (localNode = el),
        () => props.ref,
      )}
    />
  );
};
