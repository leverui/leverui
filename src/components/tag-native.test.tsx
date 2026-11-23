import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import { Tag } from './tag-exports';

type GetChildProps = Parameters<RenderChild>[0];

/** Render a caller-owned native close button with merged Tag attributes. */
function renderOwnedClose(getProps: GetChildProps): JSX.Element {
  return <button {...getProps({ class: 'owned-close' })} data-testid="owned-close" />;
}

/** Render a caller-owned native label with merged Tag attributes. */
function renderOwnedLabel(getProps: GetChildProps): JSX.Element {
  return <strong {...getProps()} data-testid="owned-label" />;
}

/** Preserve native close defaults and caller-owned part content without a provider. */
function verifiesOwnedTagParts(): void {
  let closeCount = 0;

  /** Count the native close button's click event. */
  function closeTag(): void {
    closeCount += 1;
  }

  render(
    /** Construct parts only inside their native root. */
    () => (
      <Tag.Root>
        <Tag.Label asChild={renderOwnedLabel}>Draft</Tag.Label>
        <Tag.CloseTrigger asChild={renderOwnedClose} onClick={closeTag} />
      </Tag.Root>
    ),
  );
  const label = screen.getByTestId('owned-label');
  expect(label.tagName).toBe('STRONG');
  expect(label.className).toContain('lui-tag__label');
  expect(label.textContent).toBe('Draft');
  const close = screen.getByTestId('owned-close');
  expect(close.tagName).toBe('BUTTON');
  expect(close.getAttribute('type')).toBe('button');
  expect(close.getAttribute('aria-label')).toBe('Close');
  expect(close.className).toContain('lui-tag__closeTrigger');
  expect(close.className).toContain('owned-close');
  expect(close.querySelector('svg')).not.toBeNull();
  close.click();
  expect(closeCount).toBe(1);
}

it('preserves caller-owned Tag label and close controls', verifiesOwnedTagParts);

/** Reject runtime choices that authored Tag selectors cannot represent. */
function verifiesInvalidTagChoices(): void {
  /** Mount a Tag with an unsupported size. */
  function mountInvalidSize(): void {
    render(() => <Tag.Root size={'giant' as 'sm'} />);
  }

  /** Mount a Tag with an empty palette selector. */
  function mountInvalidPalette(): void {
    render(() => <Tag.Root colorPalette=" " />);
  }

  expect(mountInvalidSize).toThrow(/Tag size is unsupported/);
  expect(mountInvalidPalette).toThrow(/Tag colorPalette must be a nonempty/);
}

it('rejects Tag choices without authored CSS rules', verifiesInvalidTagChoices);
