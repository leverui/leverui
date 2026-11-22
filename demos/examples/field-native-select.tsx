import { type JSX } from '@solidjs/web';
import { Field, HStack, Input, NativeSelect } from '../../src';

/** Show Field's label association with a native select control. */
export function FieldWithNativeSelect(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Plan</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field>
          <option value="1">Free</option>
          <option value="2">Pro</option>
          <option value="3">Team</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}

/** Point the field label at the amount input instead of the first control. */
export function FieldWithTargetControl(): JSX.Element {
  return (
    <Field.Root target="amount" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
      <Field.Label>Price</Field.Label>
      <HStack gap="2">
        <Field.Item value="currency">
          <NativeSelect.Root style={{ width: '150px' }}>
            <NativeSelect.Field aria-label="Currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Item>
        <Field.Item value="amount">
          <Input type="number" placeholder="0.00" />
        </Field.Item>
      </HStack>
    </Field.Root>
  );
}
