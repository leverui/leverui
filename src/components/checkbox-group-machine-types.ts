import { type Accessor } from 'solid-js';

/** Inputs accepted by the primitive's Solid Checkbox group machine. */
export interface UseCheckboxGroupProps {
  defaultValue?: Accessor<string[]> | string[];
  value?: Accessor<string[]>;
  name?: string;
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  maxSelectedValues?: number;
}

export interface CheckboxGroupItemProps {
  value: string | undefined;
}

export interface CheckboxGroupItemState {
  checked: boolean | undefined;
  onCheckedChange: () => void;
  name: string | undefined;
  disabled: boolean;
  readOnly: boolean | undefined;
  invalid: boolean;
}

/** Expose selected values and item props without a primitive declaration dependency. */
export interface CheckboxGroupApi {
  isChecked: (value: string | undefined) => boolean;
  value: Accessor<string[]>;
  name: string | undefined;
  disabled: boolean;
  readOnly: boolean | undefined;
  invalid: boolean;
  setValue: (next: string[] | ((previous: string[]) => string[])) => void;
  addValue: (value: string) => void;
  toggleValue: (value: string) => void;
  getItemProps: (item: CheckboxGroupItemProps) => CheckboxGroupItemState;
}

export type UseCheckboxGroupReturn = Accessor<CheckboxGroupApi>;
