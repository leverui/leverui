import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { Link, LinkBox, LinkOverlay, type LinkOverlayProps } from '../index';

type GetChildProps = Parameters<NonNullable<LinkOverlayProps['asChild']>>[0];

/** Render the recipe Link inside the overlay's stretched navigation area. */
function renderRecipeLink(getProps: GetChildProps): JSX.Element {
  return (
    <Link {...getProps()} href="#composed" variant="underline" data-testid="composed">
      Composed link
    </Link>
  );
}

/** Verify overlay styling composes with a nested public Link component. */
function verifiesComposedOverlay(): void {
  render(
    /** Mount both style layers inside the positioned card. */
    () => (
      <LinkBox>
        <LinkOverlay asChild={renderRecipeLink} />
      </LinkBox>
    ),
  );
  const link = screen.getByTestId('composed');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#composed');
  expect(link.className).toContain('lui-link');
  expect(link.className).toContain('lui-linkbox__overlay');
  expect(link.hasAttribute('variant')).toBe(false);
}

test('LinkOverlay composes with a styled Link child', verifiesComposedOverlay);
