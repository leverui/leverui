import * as checkbox from '@zag-js/checkbox';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { mergeProps } from '../../utils/merge-part-props';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useFieldContext } from '../field/index';
import { useCheckboxGroupContext } from './use-checkbox-group-context';

export type UseCheckboxProps = Optional<Omit<checkbox.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseCheckboxReturn = Accessor<checkbox.Api<PropTypes>>;

/** Create the checkbox state and return its API. */
export const useCheckbox = (ownProps: MaybeAccessor<UseCheckboxProps> = {}): UseCheckboxReturn => {
  const checkboxGroup = useCheckboxGroupContext();

  const props = createMemo(() => {
    const resolvedProps = runIfFn(ownProps);
    return mergeProps(
      checkboxGroup?.().getItemProps({ value: resolvedProps.value }) ?? {},
      resolvedProps,
    );
  });

  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const field = useFieldContext();

  const machineProps = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    disabled: field?.().disabled,
    readOnly: field?.().readOnly,
    invalid: field?.().invalid,
    required: field?.().required,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props(),
  }));

  const service = useMachine(checkbox.machine, machineProps);
  return createMemo(() => checkbox.connect(service, normalizeProps));
};
