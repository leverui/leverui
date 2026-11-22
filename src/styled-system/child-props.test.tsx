import { render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { mergeChildProps } from './child-props';

/** Verify a composed child forwards its mounted element to both ref owners. */
function verifiesBothRefs(): void {
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;

  /** Record the parent's mounted element. */
  function parentRef(element: HTMLElement): void {
    parentElement = element;
  }

  /** Record the child's mounted element. */
  function childRef(element: HTMLElement): void {
    childElement = element;
  }

  render(
    /** Mount a child with independently supplied callback refs. */
    () => (
      <div
        {...mergeChildProps(
          /** Supply the styled parent's ref. */
          () => ({ ref: parentRef }),
          { ref: childRef },
        )}
        data-testid="composed-child"
      />
    ),
  );

  const element = screen.getByTestId('composed-child');
  expect(parentElement).toBe(element);
  expect(childElement).toBe(element);
}

it('forwards a composed child to both callback refs', verifiesBothRefs);
