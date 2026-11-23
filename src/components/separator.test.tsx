import { fireEvent, render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { Separator, SeparatorPropsProvider } from '../index';

/** Verify child-owned separator elements keep both refs and events. */
function verifiesSeparatorChildComposition(): void {
  let parentElement: HTMLElement | undefined;
  let childElement: HTMLElement | undefined;
  const clicks: string[] = [];

  /** Store the separator ref received by the parent. */
  function recordParentRef(element: HTMLElement): void {
    parentElement = element;
  }

  /** Store the native ref received by the child. */
  function recordChildRef(element: HTMLElement): void {
    childElement = element;
  }

  /** Record a parent-owned click on the separator. */
  function recordParentClick(): void {
    clicks.push('parent');
  }

  /** Record a child-owned click on the separator. */
  function recordChildClick(): void {
    clicks.push('child');
  }

  render(
    /** Mount the child-owned element without a styling provider. */
    () => (
      <Separator
        orientation="vertical"
        ref={recordParentRef}
        onClick={recordParentClick}
        asChild={
          /** Merge both owners' native props onto the child span. */
          (getProps) => (
            <span
              {...getProps({ ref: recordChildRef, onClick: recordChildClick })}
              data-testid="child-separator"
            />
          )
        }
      />
    ),
  );

  const separator = screen.getByTestId('child-separator');
  expect(separator.tagName).toBe('SPAN');
  expect(separator.getAttribute('role')).toBe('separator');
  expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  expect(separator.className).toContain('lui-separator');
  expect(parentElement).toBe(separator);
  expect(childElement).toBe(separator);
  fireEvent.click(separator);
  expect(clicks).toEqual(['child', 'parent']);
}

it('composes native refs and events on a child-owned separator', verifiesSeparatorChildComposition);

/** Keep visual provider defaults separate from instance-owned ARIA. */
function verifiesProviderOrientationParity(): void {
  render(
    /** Supply a visual orientation default without an instance orientation. */
    () => (
      <SeparatorPropsProvider value={{ orientation: 'vertical' }}>
        <Separator data-testid="provider-separator" />
      </SeparatorPropsProvider>
    ),
  );

  const separator = screen.getByTestId('provider-separator');
  expect(separator.getAttribute('role')).toBe('separator');
  expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
  expect(separator.getAttribute('data-orientation')).toBe('vertical');
}

it('keeps provider orientation separate from native ARIA', verifiesProviderOrientationParity);
