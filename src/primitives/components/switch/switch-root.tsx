import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/switch';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseSwitchProps, useSwitch } from './use-switch';
import { SwitchProvider } from './use-switch-context';

export type SwitchRootState = RootState;

export type SwitchRootBaseProps = UseSwitchProps & PolymorphicProps<'label', SwitchRootState>;
export type SwitchRootProps = Assign<HTMLProps<'label'>, SwitchRootBaseProps>;

/** Render the Switch root. */
export const SwitchRoot = (props: SwitchRootProps) => {
  const [switchProps, localProps] = createSplitProps<UseSwitchProps>()(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'label',
    'name',
    'onCheckedChange',
    'readOnly',
    'required',
    'value',
  ]);
  const api = useSwitch(switchProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <SwitchProvider value={api}>
      <primitive.label {...mergedProps} state={api().getRootState()} />
    </SwitchProvider>
  );
};
