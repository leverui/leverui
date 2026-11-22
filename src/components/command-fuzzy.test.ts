import { describe, expect, it } from 'vitest';
import { commandScore, createCommandMatcher, prepareCommand } from './command-fuzzy-score';
import { getCommandMatchRanges } from './command-highlight';

describe('Command search' /** Exercise ranking and highlighting independently of the Command UI. */, () => {
  it('ranks exact, boundary, keyword, and missing matches' /** Preserve the relative match priorities. */, () => {
    const matcher = createCommandMatcher('settings');
    const exact = matcher(prepareCommand('Settings'));
    const prefix = matcher(prepareCommand('Settings panel'));
    const keyword = matcher(prepareCommand('Preferences', ['settings']));
    const missing = matcher(prepareCommand('Calendar'));
    expect(exact).toBe(1);
    expect(prefix).toBeGreaterThan(keyword);
    expect(keyword).toBeGreaterThan(0);
    expect(missing).toBe(0);
  });

  it('matches separate words and normalized accents without changing item data' /** Keep fuzzy matching pure across keywords and accents. */, () => {
    const keywords = ['workspace'];
    const prepared = prepareCommand('Open résumé', keywords);
    expect(createCommandMatcher('resume open')(prepared)).toBeGreaterThan(0);
    expect(commandScore('Open résumé', 'résumé')).toBeGreaterThan(0);
    expect(keywords).toEqual(['workspace']);
    expect(createCommandMatcher('missing open')(prepared)).toBe(0);
  });

  it('returns original text ranges for exact, camel-case, and multiword searches' /** Highlight source text while preserving the user's visible spelling. */, () => {
    expect(getCommandMatchRanges('résumé', 'resume')).toEqual([[0, 6]]);
    expect(getCommandMatchRanges('OpenSettings', 'OS')).toEqual([
      [0, 1],
      [4, 5],
    ]);
    expect(getCommandMatchRanges('Open file', 'file open')).toEqual([
      [0, 4],
      [5, 9],
    ]);
    expect(getCommandMatchRanges('Open file', '')).toEqual([]);
  });
});
