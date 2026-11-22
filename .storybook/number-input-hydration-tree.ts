import { createComponent, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { PolymorphicProps } from '../src/primitives/components/factory';
import type { NumberInput as NumberInputExport } from '../src';

export interface NumberInputHydrationComponents {
  NumberInput: typeof NumberInputExport;
}

/** Mark the selected root when Solid delivers its native ref. */
function markRootRef(element: Element): void {
  element.setAttribute('data-root-ref', 'true');
}

/** Mark the input when Solid delivers the outer Number Input ref. */
function markParentInputRef(element: Element): void {
  element.setAttribute('data-parent-ref', 'true');
}

/** Mark the same input when its caller-owned child ref arrives. */
function markChildInputRef(element: HTMLInputElement): void {
  element.setAttribute('data-child-ref', 'true');
}

/** Mark a caller input event while the primitive handles the same edit. */
function recordChildInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
  event.currentTarget.setAttribute('data-child-input', 'true');
}

/** Build one identical Number Input tree for published SSR and client hydration. */
export function renderNumberInputHydrationTree({
  NumberInput,
}: NumberInputHydrationComponents): JSX.Element {
  return createComponent(NumberInput.Root, {
    as: 'section' as const,
    ref: markRootRef,
    defaultValue: 3,
    min: 0,
    max: 10,
    name: 'hydrated-quantity',
    /** Render the label and controls in stable hydration order. */
    get children() {
      return [
        createComponent(NumberInput.Label, { children: 'Hydrated quantity' }),
        createComponent(NumberInput.Input, {
          ref: markParentInputRef,
          /** Preserve machine props on a caller-rendered native input. */
          asChild: (getProps: Parameters<NonNullable<PolymorphicProps<'input'>['asChild']>>[0]) =>
            createComponent(
              Dynamic,
              merge(
                { component: 'input' as const, 'data-testid': 'hydrated-number-input' },
                getProps({
                  ref: markChildInputRef,
                  onInput: recordChildInput,
                }),
              ),
            ),
        }),
        createComponent(NumberInput.HiddenInput, { 'data-testid': 'hydrated-number-hidden' }),
        createComponent(NumberInput.Control, {
          /** Hydrate a caller-selected trigger inside the public Control. */
          get children() {
            return createComponent(NumberInput.IncrementTrigger, {
              as: 'button' as const,
              'data-testid': 'hydrated-number-increment',
            });
          },
        }),
        createComponent(NumberInput.ValueText, {
          as: 'span' as const,
          'data-testid': 'hydrated-number-value',
        }),
      ];
    },
  });
}
