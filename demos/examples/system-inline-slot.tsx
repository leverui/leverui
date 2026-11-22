import { type JSX } from '@solidjs/web';

/** Keep a native checkbox and label with stable consumer part hooks. */
export function SystemCheckboxParts(): JSX.Element {
  return (
    <div class="consumer-system-checkbox" data-colored>
      <input class="consumer-system-checkbox__control" id="checkbox" type="checkbox" checked />
      <label class="consumer-system-checkbox__label" for="checkbox">
        Checkbox
      </label>
    </div>
  );
}
