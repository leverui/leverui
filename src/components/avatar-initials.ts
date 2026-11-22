/** Derive the first and last initials used when no Avatar image is available. */
export function getAvatarInitials(name: string): string {
  const words = name.trim().split(/\s+/u);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return `${first}${last}`;
}
