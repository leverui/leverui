import { splitProps } from '../primitives/utils/split-props';
import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HStack, Stack, type StackProps } from './stack';

export type PasswordStrengthMeterProps = Omit<StackProps<'div'>, 'children' | 'as' | 'asChild'> & {
  value: number;
  max?: number;
};

type StrengthPresentation = {
  label: 'Low' | 'Medium' | 'High';
  level: 'low' | 'medium' | 'high';
};

/** Choose the label and palette for a strength percentage. */
function strengthPresentation(percent: number): StrengthPresentation {
  if (percent < 33) return { label: 'Low', level: 'low' };
  if (percent < 66) return { label: 'Medium', level: 'medium' };
  return { label: 'High', level: 'high' };
}

/** Render segmented password strength with palette thresholds. */
export function PasswordStrengthMeter(props: PasswordStrengthMeterProps): JSX.Element {
  const [local, rest] = splitProps(props, ['value', 'max', 'class']);
  /** Use four segments unless a custom maximum is supplied. */
  const max = (): number => local.max ?? 4;
  /** Derive the current label and active palette from the value. */
  const presentation = () => strengthPresentation((local.value / max()) * 100);
  /** Rebuild the segment indexes when the maximum changes. */
  const segments = () =>
    Array.from(
      { length: max() },
      /** Identify each segment by its position. */
      (_, index) => index,
    );

  return (
    <Stack
      align="flex-end"
      gap="1"
      {...rest}
      class={['leverui-password-strength-meter', local.class]}
      data-strength-level={presentation().level}
    >
      <HStack class="leverui-password-strength-meter__track">
        <For each={segments()}>
          {
            /** Render one selected or unselected strength segment. */
            (index) => (
              <div
                class="leverui-password-strength-meter__segment"
                data-selected={index < local.value ? '' : undefined}
              />
            )
          }
        </For>
      </HStack>
      <Show when={presentation().label}>
        <HStack class="leverui-password-strength-meter__label">{presentation().label}</HStack>
      </Show>
    </Stack>
  );
}
