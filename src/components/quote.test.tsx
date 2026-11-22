import { fireEvent, render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Quote } from '../index';

/** Verify consumer-owned q elements receive both owners' native behavior. */
function verifiesQuoteChildComposition(): void {
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;
  const clicks: string[] = [];

  /** Keep the element supplied to the Quote ref. */
  function recordParentRef(element: HTMLElement): void {
    parentElement = element;
  }

  /** Keep the element supplied to the child-owned ref. */
  function recordChildRef(element: HTMLElement): void {
    childElement = element;
  }

  /** Record the parent's native click handler. */
  function recordParentClick(): void {
    clicks.push('parent');
  }

  /** Record the child's native click handler. */
  function recordChildClick(): void {
    clicks.push('child');
  }

  render(
    /** Mount the consumer-owned element as native markup. */
    () => (
      <>
        <Quote
          cite="https://example.com/child-source"
          ref={recordParentRef}
          onClick={recordParentClick}
          asChild={
            /** Merge the child's ref and click behavior onto the native q. */
            (getProps) => (
              <q
                {...getProps({
                  ref: recordChildRef,
                  onClick: recordChildClick,
                })}
                data-testid="child-quote"
              >
                Consumer-owned quotation
              </q>
            )
          }
        />
      </>
    ),
  );

  const quote = screen.getByTestId('child-quote');
  expect(quote.tagName).toBe('Q');
  expect(quote.getAttribute('cite')).toBe('https://example.com/child-source');
  expect(quote.className).toContain('leverui-quote');
  expect(parentElement).toBe(quote);
  expect(childElement).toBe(quote);
  fireEvent.click(quote);
  expect(clicks).toHaveLength(2);
  expect(clicks).toContain('parent');
  expect(clicks).toContain('child');
}

it('composes quotation refs and events on an owned child', verifiesQuoteChildComposition);
