import { type JSX } from '@solidjs/web';
import { type UseFieldContext, useFieldContext } from './use-field-context';

export interface FieldContextProps {
  children: (context: UseFieldContext) => JSX.Element;
}

/** Render the Field context context through a function child. */
export const FieldContext = (props: FieldContextProps) => props.children(useFieldContext());
