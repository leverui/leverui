import { type JSX } from '@solidjs/web';
import { PackedField } from './field-example';
import { PackedNativeSelect } from './native-select-example';
import { PackedNumberInput } from './number-input-example';
import { PackedPinInput } from './pin-input-example';

/** Render the first group of packaged form controls. */
export default function PackedCoreFieldsA(): JSX.Element {
  return (
    <>
      <PackedField />
      <PackedNativeSelect />
      <PackedNumberInput />
      <PackedPinInput />
    </>
  );
}
