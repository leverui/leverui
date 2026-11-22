import { type JSX } from '@solidjs/web';
import { type UseFieldsetContext, useFieldsetContext } from './use-fieldset-context';

export interface FieldsetContextProps {
  children: (context: UseFieldsetContext) => JSX.Element;
}

/** Render the Fieldset context context through a function child. */
export const FieldsetContext = (props: FieldsetContextProps) =>
  props.children(useFieldsetContext());
