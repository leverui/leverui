import { mergeProps } from '../../utils/merge-part-props';
import type { RootState } from '@zag-js/switch';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseSwitchReturn } from './use-switch';
import { SwitchProvider } from './use-switch-context';

interface RootProviderProps {
  value: UseSwitchReturn;
}

export type SwitchRootProviderState = RootState;

export type SwitchRootProviderBaseProps = PolymorphicProps<'label', SwitchRootProviderState>;
export type SwitchRootProviderProps = HTMLProps<'label'> &
  RootProviderProps &
  SwitchRootProviderBaseProps;

/** Provide the Switch root provider to its children. */
export const SwitchRootProvider = (props: SwitchRootProviderProps) => {
  const [{ value: api }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <SwitchProvider value={api}>
      <primitive.label {...mergedProps} state={api().getRootState()} />
    </SwitchProvider>
  );
};
