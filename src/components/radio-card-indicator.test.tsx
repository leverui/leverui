import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { RadioCard, type RadioCardValueChangeDetails } from '../index';

afterEach(cleanup);

/** Prove a checked icon is the styled root and follows reactive selection. */
async function verifiesCheckedRoot(): Promise<void> {
  let iconElement: Element | undefined;
  let childIconElement: Element | undefined;

  /** Own the selected value while the indicator branches change. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal<string | null>('react');

    /** Select the card with the caller-rendered icon. */
    function selectSolid(): void {
      setValue('solid');
      flush();
    }

    /** Return to the card with the default radio dot. */
    function selectReact(): void {
      setValue('react');
      flush();
    }

    /** Follow the machine if a native radio input changes selection. */
    function handleValueChange(details: RadioCardValueChangeDetails): void {
      setValue(details.value);
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectSolid}>
          Select Solid
        </button>
        <button type="button" onClick={selectReact}>
          Select React
        </button>
        <RadioCard.Root value={value()} onValueChange={handleValueChange}>
          <RadioCard.Item value="react">
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>React</RadioCard.ItemText>
              <RadioCard.ItemIndicator data-testid="react-indicator" />
            </RadioCard.ItemControl>
          </RadioCard.Item>
          <RadioCard.Item value="solid">
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>Solid</RadioCard.ItemText>
              <RadioCard.ItemIndicator
                data-testid="solid-indicator"
                ref={
                  /** Capture the actual custom indicator root. */
                  (element: Element) => {
                    iconElement = element;
                  }
                }
                checked={
                  /** Put styling and the forwarded ref on the SVG itself. */
                  (getProps) => (
                    <svg
                      {...getProps({
                        /** Keep the icon's own ref alongside the indicator ref. */
                        ref: (element: Element) => {
                          childIconElement = element;
                        },
                      })}
                      data-testid="custom-mark"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )
                }
              />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        </RadioCard.Root>
      </>
    );
  }

  render(
    /** Mount the controlled consumer. */
    () => <Example />,
  );
  expect(screen.queryByTestId('custom-mark')).toBeNull();
  expect(screen.getByTestId('react-indicator').querySelector('.dot')).not.toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Select Solid' }));
  await waitFor(
    /** Observe the selected SVG as the indicator root. */
    () => expect(screen.getByTestId('custom-mark').tagName.toLowerCase()).toBe('svg'),
  );
  const icon = screen.getByTestId('custom-mark');
  expect(icon.classList.contains('lui-radio-card__itemIndicator')).toBe(true);
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(icon.parentElement?.classList.contains('lui-radio-card__itemControl')).toBe(true);
  expect(iconElement).toBe(icon);
  expect(childIconElement).toBe(icon);
  expect(screen.getByTestId('react-indicator').querySelector('.dot')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Select React' }));
  expect(screen.queryByTestId('custom-mark')).toBeNull();
  expect(screen.getByTestId('react-indicator').querySelector('.dot')).not.toBeNull();
}

it('styles the custom checked element directly and updates it with selection', verifiesCheckedRoot);

/** Ignore ordinary children while retaining the radio dot. */
function verifiesDefaultChildren(): void {
  render(
    /** Mount an indicator with unsupported ordinary children. */
    () => (
      <>
        <RadioCard.Root defaultValue="solid">
          <RadioCard.Item value="solid">
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>Solid</RadioCard.ItemText>
              <RadioCard.ItemIndicator data-testid="default-indicator">
                Unexpected child
              </RadioCard.ItemIndicator>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        </RadioCard.Root>
      </>
    ),
  );
  expect(screen.queryByText('Unexpected child')).toBeNull();
  expect(screen.getByTestId('default-indicator').querySelector('.dot')).not.toBeNull();
}

it('ignores ordinary indicator children', verifiesDefaultChildren);
