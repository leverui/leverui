import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { RenderStrategyProvider, splitRenderStrategyProps } from '../../utils/render-strategy';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseDialogReturn } from './use-dialog';
import { DialogLabelPartsProvider, DialogProvider } from './use-dialog-context';
import { createLabelParts } from '../../utils/label-parts';

interface RootProviderProps {
  value: UseDialogReturn;
}

export type DialogRootProviderBaseProps = RootProviderProps & UsePresenceProps;
export interface DialogRootProviderProps extends DialogRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the Dialog root provider to its children. */
export const DialogRootProvider = (props: DialogRootProviderProps) => {
  const [presenceProps, dialogProps] = splitPresenceProps(props);
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps);

  const apiPresence = usePresence(
    mergeProps(presenceProps, () => ({ present: dialogProps.value().open })),
  );

  return (
    <DialogProvider value={dialogProps.value}>
      <DialogLabelPartsProvider value={createLabelParts()}>
        <RenderStrategyProvider value={renderStrategyProps}>
          <PresenceProvider value={apiPresence}>{dialogProps.children}</PresenceProvider>
        </RenderStrategyProvider>
      </DialogLabelPartsProvider>
    </DialogProvider>
  );
};
