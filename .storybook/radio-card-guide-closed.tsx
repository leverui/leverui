import { splitProps } from '../src/primitives/utils/split-props';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { RadioCard } from '../src';

export type ClosedRadioCardItemProps = Omit<
  RadioCard.ItemProps<'label'>,
  'children' | 'ref' | 'as' | 'asChild'
> & {
  readonly label?: JSX.Element;
  readonly description?: JSX.Element;
  readonly addon?: JSX.Element;
  readonly icon?: JSX.Element;
  readonly indicator?: JSX.Element | null;
  readonly indicatorPlacement?: 'start' | 'end' | 'inside';
  readonly inputProps?: JSX.InputHTMLAttributes<HTMLInputElement> & {
    readonly 'data-testid'?: string;
  };
  readonly ref?: (element: HTMLInputElement) => void;
};

/** Compose one native Radio Card item while forwarding its ref to the input. */
export function ClosedRadioCardItem(props: ClosedRadioCardItemProps): JSX.Element {
  const [local, itemProps] = splitProps(props, [
    'label',
    'description',
    'addon',
    'icon',
    'indicator',
    'indicatorPlacement',
    'inputProps',
    'ref',
  ]);

  /** Keep omitted indicators distinct from an explicit null. */
  function indicator(): JSX.Element | null {
    return local.indicator === undefined ? <RadioCard.ItemIndicator /> : local.indicator;
  }

  /** Create item text only after the primitive has provided the item context. */
  function Content(): JSX.Element {
    return (
      <>
        {local.icon}
        <Show when={local.label}>
          <RadioCard.ItemText>{local.label}</RadioCard.ItemText>
        </Show>
        <Show when={local.description}>
          <RadioCard.ItemDescription>{local.description}</RadioCard.ItemDescription>
        </Show>
        <Show when={local.indicatorPlacement === 'inside'}>{indicator()}</Show>
      </>
    );
  }

  return (
    <RadioCard.Item {...itemProps}>
      <RadioCard.ItemHiddenInput {...local.inputProps} ref={local.ref} />
      <RadioCard.ItemControl>
        <Show when={local.indicatorPlacement === 'start'}>{indicator()}</Show>
        <Show when={local.label || local.description || local.icon}>
          <Show when={local.indicator !== null} fallback={<Content />}>
            <RadioCard.ItemContent>
              <Content />
            </RadioCard.ItemContent>
          </Show>
        </Show>
        <Show when={(local.indicatorPlacement ?? 'end') === 'end'}>{indicator()}</Show>
      </RadioCard.ItemControl>
      <Show when={local.addon}>
        <RadioCard.ItemAddon>{local.addon}</RadioCard.ItemAddon>
      </Show>
    </RadioCard.Item>
  );
}
