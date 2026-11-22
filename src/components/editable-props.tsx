import { props as editableMachineKeys } from '@zag-js/editable';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import { omit } from '../utils/omit';
import type { PrimitiveNativeElementProps } from './primitive-native-element-props';
import type { EditableAppearance } from './editable-choices';
import type { EditableIntrinsicElement } from './editable-types';
import type { UseEditableProps, UseEditableReturn } from './editable-machine-types';
import type {
  EditableRuntimeProviderProps,
  EditableRuntimeRootProps,
} from './editable-runtime-props';

export type EditableRootBaseProps = UseEditableProps & EditableAppearance;
export type EditableRootProps<As extends EditableIntrinsicElement = 'div'> =
  PrimitiveNativeElementProps<'div', EditableRootBaseProps & NativeHtmlAliases, As>;
export type EditableRootProviderProps<As extends EditableIntrinsicElement = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    EditableAppearance & NativeHtmlAliases & { value: UseEditableReturn },
    As
  >;

type EditableDefaults = Partial<EditableRootBaseProps>;

export interface EditablePropsProviderProps {
  value: EditableDefaults | Accessor<EditableDefaults>;
  children: JSX.Element;
}

const EditablePropsContext = createOptionalContext<Accessor<EditableDefaults>>();

/** Supply reactive defaults to nested Editable roots. */
export function EditablePropsProvider(props: EditablePropsProviderProps): JSX.Element {
  /** Read defaults without freezing signal-backed caller state. */
  function readDefaults(): EditableDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <EditablePropsContext value={readDefaults}>{props.children}</EditablePropsContext>;
}

/** Apply inherited defaults before an Editable root's explicit props. */
export function useEditableRootProps(instance: EditableRuntimeRootProps): EditableRuntimeRootProps {
  const inherited = useOptionalContext(EditablePropsContext);
  return mergeProps(
    /** Recompute inherited defaults when the provider accessor changes. */
    () => inherited?.() ?? {},
    instance,
  ) as EditableRuntimeRootProps;
}

/** Apply presentation defaults while a caller-owned machine keeps its state. */
export function useEditableRootProviderProps(
  instance: EditableRuntimeProviderProps,
): EditableRuntimeProviderProps {
  const inherited = useOptionalContext(EditablePropsContext);
  return mergeProps(
    /** Keep machine options off the external store's native root element. */
    () => omit(inherited?.() ?? {}, editableMachineKeys),
    instance,
  ) as EditableRuntimeProviderProps;
}
