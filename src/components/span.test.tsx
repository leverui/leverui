import { fireEvent, render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Span } from '../index';

/** Verify child-owned native attributes, refs, and events compose correctly. */
function verifiesSpanChildComposition(): void {
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;
  const clicks: string[] = [];

  /** Store the public Span ref. */
  function recordParentRef(element: HTMLElement): void {
    parentElement = element;
  }

  /** Store the child element's ref. */
  function recordChildRef(element: HTMLElement): void {
    childElement = element;
  }

  /** Record a parent-owned click. */
  function recordParentClick(): void {
    clicks.push('parent');
  }

  /** Record a child-owned click. */
  function recordChildClick(): void {
    clicks.push('child');
  }

  render(
    /** Mount a child-owned link without a styling provider. */
    () => (
      <Span
        class="parent-link"
        style={{ color: 'red' }}
        ref={recordParentRef}
        onClick={recordParentClick}
        asChild={
          /** Merge parent attributes with the native link's props. */
          (getProps) => (
            <a
              {...getProps({ ref: recordChildRef, onClick: recordChildClick })}
              href="#destination"
              data-testid="child-span"
            >
              Destination
            </a>
          )
        }
      />
    ),
  );

  const link = screen.getByTestId('child-span');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#destination');
  expect(link.className).toContain('lui-span');
  expect(link.className).toContain('parent-link');
  expect(link.getAttribute('style')).toContain('color: red');
  expect(parentElement).toBe(link);
  expect(childElement).toBe(link);
  fireEvent.click(link);
  expect(clicks).toEqual(['child', 'parent']);
}

it('composes native refs and events on a child-owned span element', verifiesSpanChildComposition);
