import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { CheckboxCard, CheckboxGroup } from '../index';

afterEach(cleanup);

/** Verify the compound card parts preserve the primitive's native checkbox behavior. */
async function verifiesCardParts(): Promise<void> {
  render(
    /** Mount a complete card in one Solid owner. */
    () => (
      <>
        <form data-testid="card-form">
          <CheckboxCard.Root name="plan" value="pro" defaultChecked data-testid="root">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control data-testid="control">
              <CheckboxCard.Content data-testid="content">
                <CheckboxCard.Label>Pro plan</CheckboxCard.Label>
                <CheckboxCard.Description data-testid="description">
                  For teams
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator data-testid="indicator" />
            </CheckboxCard.Control>
            <CheckboxCard.Addon data-testid="addon">More details</CheckboxCard.Addon>
          </CheckboxCard.Root>
        </form>
      </>
    ),
  );
  const root = screen.getByTestId('root');
  const input = screen.getByRole('checkbox', { name: 'Pro plan' }) as HTMLInputElement;
  expect(input.checked).toBe(true);
  expect(input.name).toBe('plan');
  expect(root.className).toContain('lui-checkbox-card');
  expect(screen.getByTestId('control').className).toContain('lui-checkbox-card__control');
  expect(screen.getByTestId('content').className).toContain('lui-checkbox-card__content');
  expect(screen.getByTestId('addon').className).toContain('lui-checkbox-card__addon');
  expect(screen.getByTestId('indicator').getAttribute('data-state')).toBe('checked');
  expect(screen.getByTestId('indicator').hasAttribute('aria-hidden')).toBe(false);
  expect(screen.getByTestId('description').getAttribute('data-state')).toBe('checked');
  expect(Array.from(new FormData(screen.getByTestId('card-form') as HTMLFormElement))).toEqual([
    ['plan', 'pro'],
  ]);
  fireEvent.click(input);
  await waitFor(
    /** Observe the primitive's native state transition. */
    () => expect(input.checked).toBe(false),
  );
  expect(screen.getByTestId('indicator').getAttribute('data-state')).toBe('unchecked');
  expect(screen.getByTestId('description').getAttribute('data-state')).toBe('unchecked');
}

it('renders a composed Checkbox Card with native form state', verifiesCardParts);

/** Verify Card roots participate in the existing Checkbox group machine. */
async function verifiesGroupSelection(): Promise<void> {
  render(
    /** Share selection limits with ordinary Checkbox items. */
    () => (
      <>
        <CheckboxGroup name="topics" aria-label="Topics" defaultValue={['a']} maxSelectedValues={1}>
          <CheckboxCard.Root value="a">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Label>Alpha</CheckboxCard.Label>
            </CheckboxCard.Control>
          </CheckboxCard.Root>
          <CheckboxCard.Root value="b">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Label>Beta</CheckboxCard.Label>
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </CheckboxGroup>
      </>
    ),
  );
  const alpha = screen.getByRole('checkbox', { name: 'Alpha' }) as HTMLInputElement;
  const beta = screen.getByRole('checkbox', { name: 'Beta' }) as HTMLInputElement;
  expect(alpha.checked).toBe(true);
  expect(beta.disabled).toBe(true);
  fireEvent.click(alpha);
  await waitFor(
    /** Wait for the group to release its selection limit. */
    () => expect(beta.disabled).toBe(false),
  );
  fireEvent.click(beta);
  await waitFor(
    /** Observe the selected card's native input. */
    () => expect(beta.checked).toBe(true),
  );
  expect(beta.name).toBe('topics');
}

it('shares Checkbox group selection and limits', verifiesGroupSelection);

/** Verify reactive card defaults do not take control of a caller-owned machine. */
async function verifiesCardProvider(): Promise<void> {
  const [large, setLarge] = createSignal(false);
  const [inheritedChecked, setInheritedChecked] = createSignal(false);

  /** Create the external store in the same Solid owner as its provider. */
  function Example(): JSX.Element {
    const external = CheckboxCard.useCheckboxCard({ defaultChecked: true, name: 'external' });
    /** Keep inherited state and size reactive. */
    function readDefaults() {
      return {
        checked: inheritedChecked(),
        disabled: true,
        name: 'inherited',
        size: large() ? ('lg' as const) : ('sm' as const),
        variant: 'subtle' as const,
      };
    }
    return (
      <CheckboxCard.RootPropsProvider value={readDefaults}>
        <CheckboxCard.RootProvider value={external} variant="outline" data-testid="root">
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control data-testid="control">
            <CheckboxCard.Label>External</CheckboxCard.Label>
          </CheckboxCard.Control>
        </CheckboxCard.RootProvider>
      </CheckboxCard.RootPropsProvider>
    );
  }

  render(Example);
  const root = screen.getByTestId('root');
  const input = screen.getByRole('checkbox', { name: 'External' }) as HTMLInputElement;
  const control = screen.getByTestId('control');
  const initialClass = root.className;
  expect(input.checked).toBe(true);
  expect(input.disabled).toBe(false);
  expect(input.name).toBe('external');
  expect(root.getAttribute('data-size')).toBe('sm');
  expect(control.className).toContain('lui-checkbox-card__control');
  setLarge(true);
  flush();
  setInheritedChecked(true);
  flush();
  expect(screen.getByTestId('root')).toBe(root);
  expect(root.className).toBe(initialClass);
  expect(root.getAttribute('data-size')).toBe('lg');
  expect(input.checked).toBe(true);
  expect(input.disabled).toBe(false);
  fireEvent.click(input);
  await waitFor(
    /** Observe the external machine after the native click. */
    () => expect(input.checked).toBe(false),
  );
  expect(input.name).toBe('external');
}

it('keeps external card state under reactive presentation defaults', verifiesCardProvider);

/** Keep native Card behavior and public hooks when default CSS is suppressed. */
function verifiesUnstyledCard(): void {
  render(
    /** Mount a Card without the styling provider or recipe engine. */
    () => (
      <CheckboxCard.Root unstyled defaultChecked>
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control data-testid="control">
          <CheckboxCard.Content data-testid="content">
            <CheckboxCard.Label data-testid="label">Unstyled card</CheckboxCard.Label>
            <CheckboxCard.Description data-testid="description">Details</CheckboxCard.Description>
          </CheckboxCard.Content>
          <CheckboxCard.Indicator data-testid="indicator" />
        </CheckboxCard.Control>
        <CheckboxCard.Addon data-testid="addon">Extra</CheckboxCard.Addon>
      </CheckboxCard.Root>
    ),
  );
  expect(screen.getByRole('checkbox', { name: 'Unstyled card' })).toBeChecked();
  for (const part of ['control', 'content', 'label', 'description', 'indicator', 'addon']) {
    expect(screen.getByTestId(part).getAttribute('data-unstyled')).toBe('');
  }
}

it('keeps native Card parts when unstyled', verifiesUnstyledCard);
