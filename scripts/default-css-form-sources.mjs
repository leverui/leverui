import { inputCssFiles } from './default-css-input-sources.mjs';
import { nativeSelectCssFiles } from './default-css-native-select-sources.mjs';
import { numberInputCssFiles } from './default-css-number-input-sources.mjs';
import { selectCssFiles } from './default-css-select-sources.mjs';
import { comboboxCssFiles } from './default-css-combobox-sources.mjs';
import { dateInputCssFiles } from './default-css-date-input-sources.mjs';
import { listboxCssFiles } from './default-css-listbox-sources.mjs';
import { datePickerCssFiles } from './default-css-date-picker-sources.mjs';

/** Keep native form controls in their existing default cascade order. */
export const formCssFiles = [
  ...inputCssFiles,
  'password-input.css',
  ...numberInputCssFiles,
  ...nativeSelectCssFiles,
  ...selectCssFiles,
  ...comboboxCssFiles,
  ...listboxCssFiles,
  ...dateInputCssFiles,
  ...datePickerCssFiles,
  'input-group-field-padding.css',
  'input-group-field-padding-lg-2xl.css',
];
