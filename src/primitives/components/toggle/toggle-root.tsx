import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/toggle';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseToggleProps, useToggle } from './use-toggle';
import { ToggleProvider } from './use-toggle-context';

export type ToggleRootState = RootState;

export type ToggleRootBaseProps = UseToggleProps & PolymorphicProps<'button', ToggleRootState>;

export type ToggleRootProps = Assign<HTMLProps<'button'>, ToggleRootBaseProps>;

/** Render the Toggle root. */
export const ToggleRoot = (props: ToggleRootProps) => {
  const [useToggleProps, localProps] = createSplitProps<UseToggleProps>()(props, [
    'pressed',
    'defaultPressed',
    'disabled',
    'id',
    'onPressedChange',
  ]);

  const toggle = useToggle(useToggleProps);
  const mergedProps = mergeProps(() => toggle().getRootProps(), localProps);

  return (
    <ToggleProvider value={toggle}>
      <primitive.button {...mergedProps} state={toggle().getRootState()} />
    </ToggleProvider>
  );
};
