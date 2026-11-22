import {
  COMMAND_CONSECUTIVE_BONUS,
  COMMAND_GAP_INNER,
  COMMAND_GAP_LEADING,
  COMMAND_GAP_TRAILING,
  prepareCommandQuery,
  prepareCommandText,
  type PreparedCommandQuery,
  type PreparedCommandText,
} from './command-fuzzy-data';

/** Prepared item text and alternate search words. */
export interface PreparedCommand {
  readonly label: PreparedCommandText;
  readonly keywords: readonly PreparedCommandText[];
}

/** Prepare one item for repeated searches without changing the caller's data. */
export function prepareCommand(label: string, keywords: readonly string[] = []): PreparedCommand {
  return { label: prepareCommandText(label), keywords: keywords.map(prepareCommandText) };
}

/** Score a subsequence while rewarding contiguous and word-boundary matches. */
export function scoreCommandText(query: PreparedCommandQuery, target: PreparedCommandText): number {
  const queryLength = query.codes.length;
  const targetLength = target.codes.length;
  if (queryLength === 0) return 1;
  if (queryLength > targetLength || (query.mask & target.mask) !== query.mask) return 0;

  let matched = 0;
  for (const code of target.codes) {
    if (code === query.codes[matched]) matched += 1;
    if (matched === queryLength) break;
  }
  if (matched !== queryLength) return 0;
  if (queryLength === targetLength) return 1;

  let previousEnding = new Float64Array(targetLength);
  let previousBest = new Float64Array(targetLength);
  for (let queryIndex = 0; queryIndex < queryLength; queryIndex += 1) {
    const gap = queryIndex === queryLength - 1 ? COMMAND_GAP_TRAILING : COMMAND_GAP_INNER;
    const ending = new Float64Array(targetLength);
    const best = new Float64Array(targetLength);
    for (let targetIndex = 0; targetIndex < targetLength; targetIndex += 1) {
      const prior = targetIndex > 0 ? (best[targetIndex - 1] ?? -Infinity) : -Infinity;
      let score = -Infinity;
      if (target.codes[targetIndex] === query.codes[queryIndex]) {
        score =
          queryIndex === 0
            ? targetIndex * COMMAND_GAP_LEADING + (target.bonuses[targetIndex] ?? 0)
            : Math.max(
                (previousBest[targetIndex - 1] ?? -Infinity) + (target.bonuses[targetIndex] ?? 0),
                (previousEnding[targetIndex - 1] ?? -Infinity) + COMMAND_CONSECUTIVE_BONUS,
              );
      }
      ending[targetIndex] = score;
      best[targetIndex] = Math.max(score, prior + gap);
    }
    previousEnding = ending;
    previousBest = best;
  }
  const raw = previousBest[targetLength - 1] ?? -Infinity;
  return Number.isFinite(raw) ? 1 / (1 + Math.exp(-raw)) : 0;
}

/** Take the strongest label or keyword score for one prepared query. */
function scorePreparedCommand(query: PreparedCommandQuery, command: PreparedCommand): number {
  let best = scoreCommandText(query, command.label);
  for (const keyword of command.keywords) {
    best = Math.max(best, scoreCommandText(query, keyword) * 0.9);
  }
  return best;
}

/** Rank commands from zero to one, including independent multiword matches. */
export function createCommandMatcher(query: string): (command: PreparedCommand) => number {
  const trimmed = query.trim();
  if (!trimmed) {
    /** Keep the original order when no query is present. */
    return () => 1;
  }
  const whole = prepareCommandQuery(trimmed);
  const words = trimmed.split(/\s+/).map(prepareCommandQuery);
  /** Combine the exact phrase and all-word scores without mutating an item. */
  return (command) => {
    const phrase = scorePreparedCommand(whole, command);
    if (words.length === 1) return phrase;
    const scores = words.map(
      /** Score each word against the item's label and keywords. */
      (word) => scorePreparedCommand(word, command),
    );
    if (
      scores.some(
        /** A multiword match requires every word to appear. */
        (score) => score === 0,
      )
    )
      return phrase;
    const average =
      scores.reduce(
        /** Sum individual word scores before applying the phrase preference. */
        (sum, score) => sum + score,
        0,
      ) / scores.length;
    return Math.max(phrase, average * 0.95);
  };
}

/** Score one label and its keywords without managing prepared values. */
export function commandScore(label: string, query: string, keywords?: readonly string[]): number {
  return createCommandMatcher(query)(prepareCommand(label, keywords));
}
