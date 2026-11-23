import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  PasswordInput as PasswordInputExport,
  PasswordStrengthMeter as PasswordStrengthMeterExport,
} from '../../src';

type ServerComponents = {
  PasswordInput: typeof PasswordInputExport;
  PasswordStrengthMeter: typeof PasswordStrengthMeterExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Confirm Password Input renders default hooks and native input without a provider. */
function verifiesServerPasswordInput(): void {
  const markup = renderToString(
    /** Render from the built server entry point. */
    () => createComponent(server.PasswordInput, { 'aria-label': 'Password' }),
  );
  expect(markup).toContain('lui-password-input__visibility-trigger');
  expect(markup).toContain('type="password"');
}

test('Password Input server output uses authored hooks', verifiesServerPasswordInput);

/** Confirm the server emits selected strength state before hydration. */
function verifiesServerStrengthMeter(): void {
  const markup = renderToString(
    /** Render a selected strength segment without client-side style insertion. */
    () => createComponent(server.PasswordStrengthMeter, { value: 3 }),
  );
  expect(markup).toContain('lui-password-strength-meter__segment');
  expect(markup).toContain('data-strength-level="high"');
  expect(markup.match(/\sdata-selected(?:=""|(?=[\s/>]))/g)).toHaveLength(3);
}

test('Password Strength Meter server output includes selected state', verifiesServerStrengthMeter);
