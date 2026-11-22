import { type Accessor, createMemo } from 'solid-js';
import { useControllableState } from '../../utils/use-controllable-state';
import { useFieldsetContext } from '../fieldset/index';

export interface UseCheckboxGroupProps {
  /**
   * The initial value of `value` when uncontrolled
   */
  defaultValue?: Accessor<string[]> | string[];
  /**
   * The controlled value of the checkbox group
   */
  value?: Accessor<string[]>;
  /**
   * The name of the input fields in the checkbox group
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The callback to call when the value changes
   */
  onValueChange?: (value: string[]) => void;
  /**
   * If `true`, the checkbox group is disabled
   */
  disabled?: boolean;
  /**
   * If `true`, the checkbox group is read-only
   */
  readOnly?: boolean;
  /**
   * If `true`, the checkbox group is invalid
   */
  invalid?: boolean;
  /**
   * The maximum number of selected values
   */
  maxSelectedValues?: number;
}

export interface CheckboxGroupItemProps {
  value: string | undefined;
}

/** Create the checkbox group state and return its API. */
export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
  const fieldset = useFieldsetContext();
  /** Disabled. */
  const disabled = () => props.disabled ?? fieldset?.()?.disabled;
  /** Invalid. */
  const invalid = () => props.invalid ?? fieldset?.()?.invalid;
  const interactive = createMemo(() => !(disabled() || props.readOnly));

  const [value, setValue] = useControllableState({
    value: props.value,
    defaultValue: props.defaultValue || [],
    onChange: props.onValueChange,
  });

  return createMemo(() => {
    /** Whether checked. */
    const isChecked = (val: string | undefined) => {
      return value().some((v) => String(v) === String(val));
    };

    /** Toggle value. */
    const toggleValue = (val: string) => {
      if (isChecked(val)) removeValue(val);
      else addValue(val);
    };

    const isAtMax = props.maxSelectedValues != null && value().length >= props.maxSelectedValues;

    /** Add value. */
    const addValue = (val: string) => {
      if (!interactive()) return;
      if (isChecked(val)) return;
      if (isAtMax) return;
      setValue(value().concat(val));
    };

    /** Remove value. */
    const removeValue = (val: string) => {
      if (!interactive()) return;
      setValue(value().filter((v) => String(v) !== String(val)));
    };

    /** Get the item props. */
    const getItemProps = (itemProps: CheckboxGroupItemProps) => {
      const checked = itemProps.value != null ? isChecked(itemProps.value) : undefined;
      return {
        checked,
        /** Handle checked change. */
        onCheckedChange() {
          if (itemProps.value != null) {
            toggleValue(itemProps.value);
          }
        },
        name: props.name,
        disabled: disabled() || (isAtMax && !checked),
        readOnly: props.readOnly,
        invalid: invalid(),
      };
    };

    return {
      isChecked,
      value,
      name: props.name,
      disabled: disabled(),
      readOnly: props.readOnly,
      invalid: invalid(),
      setValue,
      addValue,
      toggleValue,
      getItemProps,
    };
  });
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>;
