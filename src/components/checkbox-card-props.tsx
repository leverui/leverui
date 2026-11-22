import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { omit } from '../utils/omit';
import { checkboxMachineKeys } from './checkbox-props';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  CheckboxCardBaseProps,
  CheckboxCardRuntimeProviderProps,
  CheckboxCardRuntimeRootProps,
} from './checkbox-card-root-props';

export type {
  CheckboxCardRootProps,
  CheckboxCardRootProviderProps,
  CheckboxCardRuntimeProviderProps,
  CheckboxCardRuntimeRootProps,
} from './checkbox-card-root-props';

export type CheckboxCardDefaults = Partial<CheckboxCardBaseProps>;

export interface CheckboxCardRootPropsProviderProps {
  value: CheckboxCardDefaults | Accessor<CheckboxCardDefaults>;
  children: JSX.Element;
}

const CheckboxCardPropsContext = createOptionalContext<Accessor<CheckboxCardDefaults>>();

/** Supply reactive card defaults without owning a particular machine or element. */
export function CheckboxCardRootPropsProvider(
  props: CheckboxCardRootPropsProviderProps,
): JSX.Element {
  /** Read the latest object or accessor supplied by the consumer. */
  function readDefaults(): CheckboxCardDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CheckboxCardPropsContext value={readDefaults}>{props.children}</CheckboxCardPropsContext>;
}

/** Give a card root's instance props precedence over inherited defaults. */
export function useCheckboxCardProps(
  instance: CheckboxCardRuntimeRootProps,
): CheckboxCardRuntimeRootProps {
  const inherited = useOptionalContext(CheckboxCardPropsContext);
  return mergeRecipeProps<CheckboxCardRuntimeRootProps>(
    /** Re-read defaults when the nearest provider changes. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Preserve caller-owned machine state while inheriting card presentation defaults. */
export function useCheckboxCardRootProviderProps(
  instance: CheckboxCardRuntimeProviderProps,
): CheckboxCardRuntimeProviderProps {
  const inherited = useOptionalContext(CheckboxCardPropsContext);
  return mergeRecipeProps<CheckboxCardRuntimeProviderProps>(
    /** Filter machine state before passing defaults to an external store. */
    () => omit(inherited?.() ?? {}, checkboxMachineKeys),
    instance,
  );
}
