import * as qrCode from '@zag-js/qr-code';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseQrCodeProps = Optional<Omit<qrCode.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseQrCodeReturn = Accessor<qrCode.Api<PropTypes>>;

/** Create the qr code state and return its API. */
export const useQrCode = (props?: MaybeAccessor<UseQrCodeProps>): UseQrCodeReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<qrCode.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(qrCode.machine, machineProps);
  return createMemo(() => qrCode.connect(service, normalizeProps));
};
