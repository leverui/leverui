import {
  COMMAND_CONSECUTIVE_BONUS,
  COMMAND_GAP_INNER,
  COMMAND_GAP_LEADING,
  COMMAND_GAP_TRAILING,
  COMMAND_MAX_LENGTH,
  normalizeCommandText,
  prepareCommandQuery,
  prepareCommandText,
  type PreparedCommandQuery,
  type PreparedCommandText,
} from './command-fuzzy-data';
import { scoreCommandText } from './command-fuzzy-score';

/** Recover the highest-scoring character positions from the fuzzy score grid. */
function matchPositions(
  query: PreparedCommandQuery,
  target: PreparedCommandText,
): number[] | undefined {
  const width = target.codes.length;
  const height = query.codes.length;
  if (height === 0 || scoreCommandText(query, target) === 0) return undefined;
  if (height === width) {
    /** Keep one position for every character of an exact match. */
    return Array.from({ length: height }, (_unused, index) => index);
  }

  const ending = new Float64Array(width * height);
  const best = new Float64Array(width * height);
  for (let row = 0; row < height; row += 1) {
    const gap = row === height - 1 ? COMMAND_GAP_TRAILING : COMMAND_GAP_INNER;
    for (let column = 0; column < width; column += 1) {
      const index = row * width + column;
      const previous = column > 0 ? (best[index - 1] ?? -Infinity) : -Infinity;
      let score = -Infinity;
      if (target.codes[column] === query.codes[row]) {
        score =
          row === 0
            ? column * COMMAND_GAP_LEADING + (target.bonuses[column] ?? 0)
            : column > 0
              ? Math.max(
                  (best[index - width - 1] ?? -Infinity) + (target.bonuses[column] ?? 0),
                  (ending[index - width - 1] ?? -Infinity) + COMMAND_CONSECUTIVE_BONUS,
                )
              : -Infinity;
      }
      ending[index] = score;
      best[index] = Math.max(score, previous + gap);
    }
  }

  const positions: number[] = [];
  let required = false;
  let column = width - 1;
  for (let row = height - 1; row >= 0; row -= 1) {
    for (; column >= 0; column -= 1) {
      const index = row * width + column;
      if (ending[index] === -Infinity || (!required && ending[index] !== best[index])) continue;
      required =
        row > 0 &&
        column > 0 &&
        best[index] === (ending[index - width - 1] ?? -Infinity) + COMMAND_CONSECUTIVE_BONUS;
      positions.unshift(column);
      column -= 1;
      break;
    }
  }
  return positions.length === height ? positions : undefined;
}

/** Preserve each normalized character's original text position. */
function normalizedOrigin(text: string): { value: string; origin: number[] } {
  let value = '';
  const origin: number[] = [];
  for (let index = 0; index < text.length && origin.length < COMMAND_MAX_LENGTH; index += 1) {
    const normalized = normalizeCommandText(text[index] ?? '');
    for (let offset = 0; offset < normalized.length; offset += 1) origin.push(index);
    value += normalized;
  }
  return { value, origin };
}

/** Return original-text ranges to emphasize in a Command item label. */
export function getCommandMatchRanges(text: string, query: string): Array<[number, number]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const { value, origin } = normalizedOrigin(text);
  const target = prepareCommandText(value);
  let positions = matchPositions(prepareCommandQuery(trimmed), target);
  if (!positions) {
    const words = new Set<number>();
    for (const word of trimmed.split(/\s+/)) {
      for (const position of matchPositions(prepareCommandQuery(word), target) ?? []) {
        words.add(position);
      }
    }
    positions = [...words].sort(
      /** Keep highlights in visual text order. */
      (left, right) => left - right,
    );
  }

  const ranges: Array<[number, number]> = [];
  for (const position of positions) {
    const index = origin[position];
    if (index === undefined) continue;
    const last = ranges[ranges.length - 1];
    if (last && last[1] >= index) last[1] = index + 1;
    else ranges.push([index, index + 1]);
  }
  return ranges;
}
