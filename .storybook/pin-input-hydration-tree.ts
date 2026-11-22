import type { PolymorphicProps } from '../src/primitives/components/factory';
import { createComponent, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { PinInput as PinInputExport } from '../src';

export interface PinInputHydrationComponents {
  PinInput: typeof PinInputExport;
}

/** Mark the selected root when Solid delivers its native ref. */
function markRootRef(element: Element): void {
  element.setAttribute('data-root-ref', 'true');
}

/** Mark the first indexed field when its outer ref arrives. */
function markParentInputRef(element: Element): void {
  element.setAttribute('data-parent-ref', 'true');
}

/** Mark the same field when its caller-owned child ref arrives. */
function markChildInputRef(element: HTMLInputElement): void {
  element.setAttribute('data-child-ref', 'true');
}

/** Mark an input event after the primitive handles the caller-owned field. */
function recordChildInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
  event.currentTarget.setAttribute('data-child-input', 'true');
}

/** Build the same public Pin Input tree for SSR and browser hydration. */
export function renderPinInputHydrationTree({
  PinInput,
}: PinInputHydrationComponents): JSX.Element {
  return createComponent(PinInput.Root, {
    as: 'section' as const,
    ref: markRootRef,
    count: 4,
    mask: true,
    name: 'hydrated-code',
    defaultValue: ['3', '', '', ''],
    /** Keep the label and fields in stable hydration order. */
    get children() {
      return [
        createComponent(PinInput.Label, { children: 'Hydrated code' }),
        createComponent(PinInput.HiddenInput, {}),
        createComponent(PinInput.Control, {
          /** Put a caller-rendered first field beside ordinary fields. */
          get children() {
            return [
              createComponent(PinInput.Input, {
                index: 0,
                ref: markParentInputRef,
                /** Preserve machine props on the caller's native input. */
                asChild: (
                  getProps: Parameters<NonNullable<PolymorphicProps<'input'>['asChild']>>[0],
                ) =>
                  createComponent(
                    Dynamic,
                    merge(
                      { component: 'input' as const, 'data-testid': 'hydrated-pin-0' },
                      getProps({
                        ref: markChildInputRef,
                        onInput: recordChildInput,
                      }),
                    ),
                  ),
              }),
              createComponent(PinInput.Input, { index: 1, 'data-testid': 'hydrated-pin-1' }),
              createComponent(PinInput.Input, { index: 2, 'data-testid': 'hydrated-pin-2' }),
              createComponent(PinInput.Input, { index: 3, 'data-testid': 'hydrated-pin-3' }),
            ];
          },
        }),
      ];
    },
  });
}
