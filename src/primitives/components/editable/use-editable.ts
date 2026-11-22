import * as editable from '@zag-js/editable';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useFieldContext } from '../field/index';

export type UseEditableProps = Optional<Omit<editable.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseEditableReturn = Accessor<editable.Api<PropTypes>>;

/** Create the editable state and return its API. */
export const useEditable = (props?: MaybeAccessor<UseEditableProps>) => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const field = useFieldContext();

  const machineProps = createMemo<editable.Props>(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      input: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    invalid: field?.().invalid,
    readOnly: field?.().readOnly,
    required: field?.().required,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(editable.machine, machineProps);
  return createMemo(() => editable.connect(service, normalizeProps));
};
