import * as pinInput from '@zag-js/pin-input';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useFieldContext } from '../field/index';

export type UsePinInputProps = Optional<Omit<pinInput.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UsePinInputReturn = Accessor<pinInput.Api<PropTypes>>;

/** Create the pin input state and return its API. */
export const usePinInput = (props: MaybeAccessor<UsePinInputProps>): UsePinInputReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const field = useFieldContext();

  const machineProps = createMemo<pinInput.Props>(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    disabled: field?.().disabled,
    readOnly: field?.().readOnly,
    required: field?.().required,
    invalid: field?.().invalid,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(pinInput.machine, machineProps);
  return createMemo(() => pinInput.connect(service, normalizeProps));
};
