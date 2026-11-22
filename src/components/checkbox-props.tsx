import type { CheckedChangeDetails, CheckedState } from '@zag-js/checkbox';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { omit } from '../utils/omit';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  CheckboxBaseProps,
  CheckboxRuntimeProviderProps,
  CheckboxRuntimeRootProps,
} from './checkbox-root-props';

export type {
  CheckboxBaseProps,
  CheckboxRootProps,
  CheckboxRootProviderProps,
  CheckboxRuntimeProviderProps,
  CheckboxRuntimeRootProps,
} from './checkbox-root-props';

export type CheckboxCheckedState = CheckedState;
export type CheckboxCheckedChangeDetails = CheckedChangeDetails;
export type CheckboxDefaults = Partial<CheckboxBaseProps>;

export interface CheckboxPropsProviderProps {
  value: CheckboxDefaults | Accessor<CheckboxDefaults>;
  children: JSX.Element;
}

const CheckboxPropsContext = createOptionalContext<Accessor<CheckboxDefaults>>();

/** Supply reactive Checkbox defaults without owning an instance's element or ref. */
export function CheckboxPropsProvider(props: CheckboxPropsProviderProps): JSX.Element {
  /** Read the current object or accessor passed by the provider consumer. */
  function readDefaults(): CheckboxDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CheckboxPropsContext value={readDefaults}>{props.children}</CheckboxPropsContext>;
}

/** Give instance props precedence over the nearest Checkbox defaults. */
export function useCheckboxProps(instance: CheckboxRuntimeRootProps): CheckboxRuntimeRootProps {
  const inherited = useOptionalContext(CheckboxPropsContext);
  return mergeRecipeProps<CheckboxRuntimeRootProps>(
    /** Re-read inherited defaults when a provider changes. */
    () => inherited?.() ?? {},
    instance,
  );
}

export const checkboxMachineKeys = [
  'checked',
  'defaultChecked',
  'disabled',
  'form',
  'id',
  'ids',
  'invalid',
  'name',
  'onCheckedChange',
  'readOnly',
  'required',
  'value',
] as const;

/** Keep machine defaults off a root driven by a caller-owned Checkbox. */
export function useCheckboxRootProviderProps(
  instance: CheckboxRuntimeProviderProps,
): CheckboxRuntimeProviderProps {
  const inherited = useOptionalContext(CheckboxPropsContext);
  return mergeRecipeProps<CheckboxRuntimeProviderProps>(
    /** Keep only presentation defaults when the external store owns behavior. */
    () => omit(inherited?.() ?? {}, checkboxMachineKeys),
    instance,
  );
}
