import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Checkbox, Stack, type CheckboxCheckedChangeDetails } from '../../src';

/** Select all weekdays and reflect partial selection as indeterminate. */
export function CheckboxIndeterminate(): JSX.Element {
  const [values, setValues] = createSignal([
    { label: 'Monday', checked: false, value: 'monday' },
    { label: 'Tuesday', checked: false, value: 'tuesday' },
    { label: 'Wednesday', checked: false, value: 'wednesday' },
    { label: 'Thursday', checked: false, value: 'thursday' },
  ]);
  const allChecked = createMemo(
    /** Require every weekday to be selected. */
    () =>
      values().every(
        /** Read one weekday's selected state. */
        (item) => item.checked,
      ),
  );
  const partlyChecked = createMemo(
    /** Require at least one selected day while some remain unselected. */
    () =>
      values().some(
        /** Read one weekday's selected state. */
        (item) => item.checked,
      ) && !allChecked(),
  );

  /** Replace one weekday without mutating the current list. */
  function updateWeekday(value: string, checked: boolean): void {
    setValues(
      /** Retain unrelated weekdays and update the matching one. */
      (current) =>
        current.map(
          /** Preserve each entry except the selected weekday. */
          (item) => (item.value === value ? { ...item, checked } : item),
        ),
    );
  }

  /** Apply the parent's new state to every weekday. */
  function updateAll(details: CheckboxCheckedChangeDetails): void {
    const checked = details.checked === true;
    setValues(
      /** Rebuild the rows with one shared checked state. */
      (current) =>
        current.map(
          /** Set one weekday to the parent's state. */
          (item) => ({ ...item, checked }),
        ),
    );
  }

  return (
    <Stack align="flex-start">
      <Checkbox.Root
        checked={partlyChecked() ? 'indeterminate' : allChecked()}
        onCheckedChange={updateAll}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Weekdays</Checkbox.Label>
      </Checkbox.Root>
      <For each={values()}>
        {
          /** Keep each weekday synchronized with the parent checkbox. */
          (item) => (
            <Checkbox.Root
              class="checkbox-example-weekday"
              checked={item.checked}
              onCheckedChange={
                /** Report this row's new state to the weekday list. */
                (details) => updateWeekday(item.value, details.checked === true)
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>{item.label}</Checkbox.Label>
            </Checkbox.Root>
          )
        }
      </For>
    </Stack>
  );
}
