import { render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import * as Breadcrumb from './breadcrumb';
import { readBreadcrumbPalette } from './breadcrumb-choices';

/** Keep native navigation semantics without a styling provider. */
function verifiesProviderFreeMarkup(): void {
  render(
    /** Mount an ancestor and current page under the semantic root. */
    () => (
      <Breadcrumb.Root data-testid="breadcrumb-root">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Components</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    ),
  );
  const root = screen.getByTestId('breadcrumb-root');
  expect(root.tagName).toBe('NAV');
  expect(root.getAttribute('aria-label')).toBe('breadcrumb');
  expect(root.getAttribute('data-size')).toBe('md');
  expect(root.getAttribute('data-variant')).toBe('plain');
  expect(root.hasAttribute('data-lui-private-style-runtime')).toBe(false);
  expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('href')).toBe('/docs');
  expect(screen.getByRole('link', { name: 'Components' }).getAttribute('aria-current')).toBe(
    'page',
  );
}

it('renders native Breadcrumb parts without a styling provider', verifiesProviderFreeMarkup);

/** Reject unsupported runtime palette shapes before they reach the DOM. */
function verifiesPaletteBoundary(): void {
  /** Read a responsive object where a scalar palette is required. */
  function readObjectPalette(): void {
    readBreadcrumbPalette({ base: 'blue' });
  }

  /** Read a palette with no usable name. */
  function readEmptyPalette(): void {
    readBreadcrumbPalette('  ');
  }

  expect(readBreadcrumbPalette(' blue ')).toBe('blue');
  expect(readBreadcrumbPalette(undefined)).toBeUndefined();
  expect(readObjectPalette).toThrow(/nonempty string/);
  expect(readEmptyPalette).toThrow(/nonempty string/);
}

it('accepts scalar palettes and rejects unsupported shapes', verifiesPaletteBoundary);
