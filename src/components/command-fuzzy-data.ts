/** Data shared by Command's search scorer and match highlighter. */
export interface PreparedCommandText {
  readonly codes: Uint16Array;
  readonly bonuses: Float32Array;
  readonly mask: number;
}

/** A normalized query with a fast character-presence mask. */
export interface PreparedCommandQuery {
  readonly codes: Uint16Array;
  readonly mask: number;
}

export const COMMAND_MAX_LENGTH = 256;
export const COMMAND_GAP_LEADING = -0.005;
export const COMMAND_GAP_TRAILING = -0.005;
export const COMMAND_GAP_INNER = -0.01;
export const COMMAND_CONSECUTIVE_BONUS = 1;

const diacritics = /[\u0300-\u036f]/g;

/** Normalize accents while bounding search work for unusually long text. */
export function normalizeCommandText(value: string): string {
  return value.normalize('NFD').replace(diacritics, '').slice(0, COMMAND_MAX_LENGTH);
}

/** Encode common Latin letters and digits for a fast impossible-match check. */
function characterMask(code: number): number {
  if (code >= 97 && code <= 122) return 1 << (code - 97);
  if (code >= 48 && code <= 57) return 1 << 26;
  return 0;
}

/** Reward the first letter of a path, word, dotted segment, or camel-case part. */
function boundaryBonus(previous: number, current: number): number {
  const lower = current >= 97 && current <= 122;
  const upper = current >= 65 && current <= 90;
  const digit = current >= 48 && current <= 57;
  if (!lower && !upper && !digit) return 0;
  if (previous === -1 || previous === 47) return 0.9;
  if (previous === 32 || previous === 45 || previous === 95) return 0.8;
  if (previous === 46) return 0.6;
  if (upper && previous >= 97 && previous <= 122) return 0.7;
  return 0;
}

/** Prepare one label or keyword for repeated fuzzy searches. */
export function prepareCommandText(value: string): PreparedCommandText {
  const original = normalizeCommandText(value);
  const lower = original.toLowerCase();
  const codes = new Uint16Array(lower.length);
  const bonuses = new Float32Array(lower.length);
  let mask = 0;
  let previous = -1;
  for (let index = 0; index < lower.length; index += 1) {
    const code = lower.charCodeAt(index);
    codes[index] = code;
    mask |= characterMask(code);
    const originalCode = original.charCodeAt(index);
    bonuses[index] = boundaryBonus(previous, originalCode);
    previous = originalCode;
  }
  return { codes, bonuses, mask };
}

/** Prepare a query once before ranking many Command items. */
export function prepareCommandQuery(value: string): PreparedCommandQuery {
  const lower = normalizeCommandText(value).toLowerCase();
  const codes = new Uint16Array(lower.length);
  let mask = 0;
  for (let index = 0; index < lower.length; index += 1) {
    const code = lower.charCodeAt(index);
    codes[index] = code;
    mask |= characterMask(code);
  }
  return { codes, mask };
}
