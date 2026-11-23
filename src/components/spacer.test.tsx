import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { Spacer } from '../index';

afterEach(cleanup);

/** Preserve both owners' refs and clicks on a caller-owned Spacer element. */
function verifiesChildComposition(): void {
  let parentElement: Element | undefined;
  let childElement: Element | undefined;
  const clicks: string[] = [];

  /** Record the Spacer consumer's selected element. */
  function recordParentRef(element: Element): void {
    parentElement = element;
  }

  /** Record the caller-owned button's selected element. */
  function recordChildRef(element: Element): void {
    childElement = element;
  }

  /** Record the Spacer consumer's click handler. */
  function recordParentClick(): void {
    clicks.push('parent');
  }

  /** Record the caller-owned button's click handler. */
  function recordChildClick(): void {
    clicks.push('child');
  }

  render(
    /** Mount a caller-owned button without a styling provider. */
    () => (
      <Spacer
        ref={recordParentRef}
        onClick={recordParentClick}
        asChild={
          /** Merge the child-owned ref and event onto Spacer's native props. */
          (getProps) => (
            <button {...getProps({ ref: recordChildRef, onClick: recordChildClick })} type="button">
              Fill space
            </button>
          )
        }
      />
    ),
  );

  const button = screen.getByRole('button', { name: 'Fill space' });
  expect(button).toHaveClass('lui-spacer');
  expect(parentElement).toBe(button);
  expect(childElement).toBe(button);
  fireEvent.click(button);
  expect(clicks).toEqual(['child', 'parent']);
}

it('composes refs and events on a caller-owned element', verifiesChildComposition);
