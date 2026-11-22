import { fireEvent, render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Strong } from '../index';

/** Verify a child-owned link composes the parent and child native contracts. */
function verifiesStrongChildComposition(): void {
  const refs: HTMLElement[] = [];
  const clicks: string[] = [];

  /** Record the public Strong ref. */
  function recordParentRef(element: HTMLElement): void {
    refs.push(element);
  }

  /** Record the child-owned link ref. */
  function recordChildRef(element: HTMLElement): void {
    refs.push(element);
  }

  /** Record the parent event after the child event. */
  function recordParentClick(): void {
    clicks.push('parent');
  }

  /** Record the child event before the parent event. */
  function recordChildClick(): void {
    clicks.push('child');
  }

  render(
    /** Mount child composition with native class hooks. */
    () => (
      <>
        <Strong
          ref={recordParentRef}
          onClick={recordParentClick}
          asChild={
            /** Merge Strong styling with the consumer-owned link. */
            (getProps) => (
              <a
                {...getProps({ ref: recordChildRef, onClick: recordChildClick })}
                href="#destination"
                data-testid="child-strong"
              >
                Destination
              </a>
            )
          }
        />
      </>
    ),
  );

  const link = screen.getByTestId('child-strong');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#destination');
  expect(refs).toEqual([link, link]);
  fireEvent.click(link);
  expect(clicks).toEqual(['child', 'parent']);
}

it('composes native refs and events on child-owned Strong content', verifiesStrongChildComposition);
