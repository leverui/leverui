import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { QrCode } from '../index';

/** Verify the default path and native QR parts from the public namespace. */
function verifiesQrCodeParts(): void {
  render(
    /** Mount the QR machine without a style provider. */
    () => (
      <QrCode.Root value="https://leverui.com" size="sm" data-testid="root">
        <QrCode.Frame data-testid="frame" aria-label="Lever UI website" />
        <QrCode.Overlay data-testid="overlay">UI</QrCode.Overlay>
        <QrCode.DownloadTrigger fileName="leverui.png" mimeType="image/png" data-testid="save">
          Save
        </QrCode.DownloadTrigger>
      </QrCode.Root>
    ),
  );

  const root = screen.getByTestId('root');
  const frame = screen.getByTestId('frame');
  const path = frame.querySelector('path');
  expect(root.hasAttribute('data-qr-code-root')).toBe(true);
  expect(root.className).toContain('leverui-qr-code__root');
  expect(root.hasAttribute('size')).toBe(false);
  expect(frame.tagName.toLowerCase()).toBe('svg');
  expect(frame.getAttribute('aria-label')).toBe('Lever UI website');
  expect(path?.getAttribute('d')).toBeTruthy();
  expect(path?.getAttribute('class')).toContain('leverui-qr-code__pattern');
  expect(screen.getByTestId('overlay').textContent).toBe('UI');
  expect(screen.getByTestId('save').tagName).toBe('BUTTON');
}

it('renders an encoded SVG and CSS hooks without a provider', verifiesQrCodeParts);

/** Preserve the same path element when controlled content changes. */
function verifiesControlledValue(): void {
  const [value, setValue] = createSignal('First code');

  /** Bind the QR value to a Solid signal. */
  function Example(): JSX.Element {
    return (
      <QrCode.Root value={value()}>
        <QrCode.Frame data-testid="reactive-frame" />
        <QrCode.Context>
          {
            /** Read the machine's current encoded value. */
            (context) => <output data-testid="reactive-value">{context().value}</output>
          }
        </QrCode.Context>
      </QrCode.Root>
    );
  }

  render(
    /** Mount the reactive example once. */
    () => <Example />,
  );
  const path = screen.getByTestId('reactive-frame').querySelector('path');
  const initialPath = path?.getAttribute('d');
  expect(screen.getByTestId('reactive-value').textContent).toBe('First code');
  setValue('Second code');
  flush();
  expect(screen.getByTestId('reactive-frame').querySelector('path')).toBe(path);
  expect(screen.getByTestId('reactive-value').textContent).toBe('Second code');
  expect(path?.getAttribute('d')).not.toBe(initialPath);
}

it('updates a controlled payload without replacing its path', verifiesControlledValue);

/** Reject QR parts without their required machine and appearance context. */
function verifiesRootRequirement(): void {
  /** Mount a QR frame without a matching root. */
  function mountOrphan(): void {
    render(
      /** Omit the QR root while mounting a native SVG frame. */
      () => <QrCode.Frame />,
    );
  }

  expect(mountOrphan).toThrow(/QrCodeRoot or QrCodeRootProvider/);
}

it('requires a QR root for its public parts', verifiesRootRequirement);
