import { expect, it } from 'vitest';
import { getAvatarInitials } from './avatar-initials';

/** Preserve first and last initials across common human-name shapes. */
function verifiesInitials(): void {
  expect(getAvatarInitials('Ada Lovelace')).toBe('AL');
  expect(getAvatarInitials('  Grace   Brewster Murray Hopper  ')).toBe('GH');
  expect(getAvatarInitials('Prince')).toBe('P');
  expect(getAvatarInitials('  ')).toBe('');
}

it('derives Avatar initials from first and last words', verifiesInitials);
