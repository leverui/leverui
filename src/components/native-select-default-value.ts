import type { NativeSelectValue } from './native-select-option-values';
import { nativeSelectValues } from './native-select-option-values';

/** Initialize the browser's selected and reset state for an uncontrolled select. */
export function applyNativeSelectDefault(
  select: HTMLSelectElement,
  value: NativeSelectValue,
): void {
  const values = nativeSelectValues(value);
  let matched = false;

  for (const option of select.options) {
    const selected = values.has(option.value) && (select.multiple || !matched);
    option.defaultSelected = selected;
    option.selected = selected;
    if (selected) matched = true;
  }

  if (!matched && !select.multiple) {
    select.selectedIndex = select.options.length ? 0 : -1;
  }
}
