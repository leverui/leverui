import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Input as InputExport, InputGroup as GroupExport } from '../src';

export interface InputGroupHydrationComponents {
  Input: typeof InputExport;
  InputGroup: typeof GroupExport;
}

/** Build the same grouped field for published SSR and client hydration. */
export function renderInputGroupHydrationTree({
  Input,
  InputGroup,
}: InputGroupHydrationComponents): JSX.Element {
  const [offset, setOffset] = createSignal('0px');

  /** Change the start offset without replacing the hydrated field. */
  function toggleOffset(): void {
    setOffset(offset() === '0px' ? '4px' : '0px');
  }

  return [
    createComponent(InputGroup, {
      id: 'hydrated-input-group',
      startElement: '@',
      endAddon: 'USD',
      /** Follow the changing offset through the group context. */
      get startOffset() {
        return offset();
      },
      /** Construct the input under the group's padding context. */
      get children() {
        return createComponent(Input, {
          id: 'hydrated-input-group-field',
          'aria-label': 'Hydrated group field',
          defaultValue: 'draft',
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'hydrated-input-group-toggle',
      type: 'button',
      onClick: toggleOffset,
      children: 'Toggle offset',
    }),
  ];
}
