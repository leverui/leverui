/**
 * Answer a typed question with Lever UI docs pages, for the home page's chat card.
 *
 * It answers from the docs only when the question is about Lever UI, which it judges from the
 * match itself rather than from a list of phrases: a word in the question must name a page
 * (or be an everyday word for one), or the best page must account for most of the question's
 * words. A question that speaks to the assistant gets a plain account of what it is, and
 * anything else is politely turned away with example questions.
 */
import type { DocsIndex } from './docs-assistant-index';
import { bestPages, correctSpelling, namesAPage, textCovers } from './docs-assistant-pages';
import { readQuestion } from './docs-assistant-terms';
import { acknowledgment, recognizeIntent, type IntentKind } from './docs-assistant-intents';
import {
  aboutAssistant,
  catalog,
  intentReply,
  offTopic,
  whatIsReply,
} from './docs-assistant-replies';

/** One docs page the answer points to. */
export interface AnswerLink {
  readonly title: string;
  readonly path: string;
  readonly summary: string;
}

/** The kind of reply, so the chat and its tests can tell replies apart. */
export type AnswerKind = 'docs' | 'catalog' | 'about' | 'notFound' | 'whatIs' | IntentKind;

/** What the assistant says, the pages it links, and whether to offer example questions. */
export interface Answer {
  readonly kind: AnswerKind;
  readonly text: string;
  readonly links: readonly AnswerLink[];
  readonly suggest?: boolean;
}

export { createDocsIndex, type DocsIndex } from './docs-assistant-index';

/** Answer a question with up to three docs pages, or a fixed reply. */
export function answerQuestion(index: DocsIndex, question: string): Answer {
  const text = question.trim();
  const whatIs = whatIsReply(index, text);
  if (whatIs) return whatIs;
  const read = readQuestion(text);
  const { tokens, hasText, toAssistant, aboutAssistant: asksWhatItIs } = read;
  const words = correctSpelling(index, read.words);
  // Only punctuation or an emoji: a question mark asks what is here, and anything else nods.
  if (!hasText) return text.includes('?') ? catalog(index) : intentReply(index, acknowledgment, []);
  const onTopic = words.length > 0 && namesAPage(index, words);
  const intent = recognizeIntent({ tokens, onTopic, toAssistant });
  if (intent) return intentReply(index, intent, onTopic ? bestPages(index, words) : []);
  if (!words.length) {
    // Nothing specific is left. "Is this a bot" and "who are you" ask what the assistant is;
    // "what do you have" and "what can you do" ask what is here.
    const asksWho = toAssistant && tokens.includes('who');
    return asksWhatItIs || asksWho ? aboutAssistant : catalog(index);
  }
  if (toAssistant && !onTopic) return aboutAssistant;
  if (!onTopic && !textCovers(index, words)) return offTopic;
  const links = bestPages(index, words);
  if (!links.length) return offTopic;
  return {
    kind: 'docs',
    text: links.length === 1 ? 'This page covers it:' : 'These pages may help:',
    links,
  };
}
