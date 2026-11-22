import * as datePicker from '@zag-js/date-picker';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseDatePickerProps = Optional<Omit<datePicker.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseDatePickerReturn = Accessor<datePicker.Api<PropTypes>>;

/** Create the date picker state and return its API. */
export const useDatePicker = (props?: MaybeAccessor<UseDatePickerProps>): UseDatePickerReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<datePicker.Props>(() => ({
    id,
    dir: locale().dir,
    locale: locale().locale,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(datePicker.machine, machineProps);
  return createMemo(() => datePicker.connect(service, normalizeProps));
};
