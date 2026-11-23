import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { RadioGroup } from '../index';

afterEach(cleanup);

/** Keep provider defaults reactive without remounting the radio machine. */
function verifiesPropsProvider(): void {
  /** Toggle inherited CSS choices while selection stays in the primitive. */
  function Example(): JSX.Element {
    const [variant, setVariant] = createSignal<'outline' | 'solid'>('outline');

    /** Switch the provider's default variant. */
    function toggleVariant(): void {
      setVariant(variant() === 'outline' ? 'solid' : 'outline');
      flush();
    }

    return (
      <>
        <button type="button" onClick={toggleVariant}>
          Toggle variant
        </button>
        <RadioGroup.PropsProvider
          value={
            /** Follow changes to the inherited Radio Group treatment. */
            () => ({ name: 'framework', defaultValue: 'react', variant: variant() })
          }
        >
          <RadioGroup.Root>
            <RadioGroup.Label>Framework</RadioGroup.Label>
            <RadioGroup.Item value="react">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>React</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="solid">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Solid</RadioGroup.ItemText>
            </RadioGroup.Item>
          </RadioGroup.Root>
        </RadioGroup.PropsProvider>
      </>
    );
  }

  render(
    /** Mount one root under reactive defaults. */
    () => <Example />,
  );
  const root = screen.getByRole('radiogroup', { name: 'Framework' });
  const react = screen.getByRole('radio', { name: 'React' }) as HTMLInputElement;
  const indicator = root.querySelector('.lui-radio-group__itemControl');
  expect(react.checked).toBe(true);
  expect(react.name).toBe('framework');
  expect(indicator).not.toBeNull();
  expect(indicator?.getAttribute('data-variant')).toBe('outline');
  const initialClass = indicator?.getAttribute('class');
  fireEvent.click(screen.getByRole('button', { name: 'Toggle variant' }));
  expect(screen.getByRole('radiogroup', { name: 'Framework' })).toBe(root);
  expect(react.checked).toBe(true);
  expect(indicator?.getAttribute('data-variant')).toBe('solid');
  expect(indicator?.getAttribute('class')).toBe(initialClass);
}

it('updates inherited appearance without replacing selection', verifiesPropsProvider);

/** Preserve the primitive attributes and refs through custom native elements. */
async function verifiesPolymorphicParts(): Promise<void> {
  let controlRef: Element | undefined;
  let indicatorRef: Element | undefined;
  render(
    /** Mount custom control and indicator elements under one machine. */
    () => (
      <>
        <RadioGroup.Root name="framework" defaultValue="react">
          <RadioGroup.Label>Framework</RadioGroup.Label>
          <RadioGroup.Item value="react">
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator
              as="strong"
              ref={
                /** Capture the actual indicator element. */
                (element) => {
                  indicatorRef = element;
                }
              }
              data-testid="react-indicator"
            />
            <RadioGroup.ItemText>React</RadioGroup.ItemText>
          </RadioGroup.Item>
          <RadioGroup.Item value="solid">
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemControl
              ref={
                /** Capture the actual child rendered by the primitive. */
                (element: Element) => {
                  controlRef = element;
                }
              }
              asChild={
                /** Put Zag state on the caller's span. */
                (getProps) => <span {...getProps()} data-testid="solid-control" />
              }
            />
            <RadioGroup.ItemText>Solid</RadioGroup.ItemText>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </>
    ),
  );
  const indicator = screen.getByTestId('react-indicator');
  const control = screen.getByTestId('solid-control');
  expect(indicator.tagName).toBe('STRONG');
  expect(control.tagName).toBe('SPAN');
  expect(indicatorRef).toBe(indicator);
  expect(controlRef).toBe(control);
  expect(indicator.getAttribute('aria-hidden')).toBe('true');
  expect(indicator.getAttribute('data-state')).toBe('checked');
  expect(indicator.querySelector('.dot')).not.toBeNull();
  expect(control.getAttribute('aria-hidden')).toBe('true');
  expect(control.getAttribute('data-state')).toBe('unchecked');
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Confirm the custom control follows the native radio selection. */
    () => expect(control.getAttribute('data-state')).toBe('checked'),
  );
  expect(indicator.getAttribute('data-state')).toBe('unchecked');
  expect(indicator.querySelector('.dot')).toBeNull();
}

it('forwards refs and machine state through custom elements', verifiesPolymorphicParts);

/** Keep native radio behavior and part hooks without a styling provider. */
function verifiesUnstyledGroup(): void {
  render(
    /** Mount an unstyled group with its visible parts. */
    () => (
      <RadioGroup.Root name="framework" defaultValue="solid" unstyled data-testid="root">
        <RadioGroup.Label data-testid="label">Framework</RadioGroup.Label>
        <RadioGroup.Item value="solid" data-testid="item">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator data-testid="indicator" />
          <RadioGroup.ItemText data-testid="text">Solid</RadioGroup.ItemText>
        </RadioGroup.Item>
      </RadioGroup.Root>
    ),
  );
  expect(screen.getByRole('radio', { name: 'Solid' })).toBeChecked();
  for (const part of ['root', 'label', 'item', 'indicator', 'text']) {
    expect(screen.getByTestId(part).hasAttribute('data-unstyled')).toBe(true);
  }
  expect(screen.getByTestId('indicator').className).toContain('lui-radiomark');
  expect(screen.getByTestId('indicator').className).toContain('lui-radio-group__itemIndicator');
}

it('keeps unstyled radio semantics without inserted presentation CSS', verifiesUnstyledGroup);
