import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import type { RenderSvgChild } from '../styled-system/svg-child-props';
import * as Blockquote from './blockquote';

type GetChildProps = Parameters<RenderChild>[0];
type GetSvgProps = Parameters<RenderSvgChild>[0];

/** Render a caller-owned section with the root's live attributes. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return <section {...getProps({ class: 'owned-root' })} data-testid="owned-quote" />;
}

/** Render a caller-owned caption with the public part hook. */
function renderOwnedCaption(getProps: GetChildProps): JSX.Element {
  return <figcaption {...getProps()} data-testid="owned-caption" />;
}

/** Render a caller-owned SVG with the default quote path. */
function renderOwnedIcon(getProps: GetSvgProps): JSX.Element {
  return <svg {...getProps({ class: 'owned-icon' })} data-testid="owned-icon" />;
}

/** Preserve native and caller-owned nodes through Blockquote composition. */
function verifiesNativeComposition(): void {
  let receivedIcon: SVGSVGElement | undefined;

  /** Capture the same caller-owned SVG that receives the part hook. */
  function captureIcon(element: SVGSVGElement): void {
    receivedIcon = element;
  }

  render(
    /** Mount parts after their owner establishes the quote scope. */
    () => (
      <Blockquote.Root asChild={renderOwnedRoot} class="custom-root" variant="solid">
        <Blockquote.Icon asChild={renderOwnedIcon} ref={captureIcon} />
        <Blockquote.Content as="section" data-testid="selected-content">
          Caller-owned quotation
        </Blockquote.Content>
        <Blockquote.Caption asChild={renderOwnedCaption}>A source</Blockquote.Caption>
      </Blockquote.Root>
    ),
  );

  const root = screen.getByTestId('owned-quote');
  expect(root.tagName).toBe('SECTION');
  expect(root.classList.contains('leverui-blockquote__root')).toBe(true);
  expect(root.classList.contains('owned-root')).toBe(true);
  expect(root.classList.contains('custom-root')).toBe(true);
  expect(root.getAttribute('data-variant')).toBe('solid');
  const content = screen.getByTestId('selected-content');
  expect(content.tagName).toBe('SECTION');
  expect(content.classList.contains('leverui-blockquote__content')).toBe(true);
  expect(
    screen.getByTestId('owned-caption').classList.contains('leverui-blockquote__caption'),
  ).toBe(true);
  const icon = screen.getByTestId('owned-icon');
  expect(icon).toBe(receivedIcon);
  expect(icon.classList.contains('leverui-blockquote__icon')).toBe(true);
  expect(icon.querySelector('path')).not.toBeNull();
}

it('composes native and caller-owned Blockquote parts', verifiesNativeComposition);
