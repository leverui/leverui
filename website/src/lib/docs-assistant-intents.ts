/**
 * What the docs assistant says to messages that are not docs questions: small talk, and
 * questions about the project itself. Each intent is recognized by words, not by phrases, so
 * "good morning!", "hey there", and "morning" are all greetings.
 */

export type IntentKind =
  | 'greeting'
  | 'smallTalk'
  | 'thanks'
  | 'farewell'
  | 'compliment'
  | 'acknowledgment'
  | 'complaint'
  | 'license'
  | 'stability'
  | 'github'
  | 'value';

/** What the assistant knows about a message, for deciding on an intent. */
export interface MessageWords {
  /** Every word of the message, lowercase. */
  readonly tokens: readonly string[];
  /** Whether the message names a Lever UI page or topic. */
  readonly onTopic: boolean;
  /** Whether the message speaks to the assistant. */
  readonly toAssistant: boolean;
}

/** A recognized intent, and the reply for it. */
export interface Intent {
  readonly kind: IntentKind;
  readonly text: string;
  /** Link the project on GitHub. */
  readonly github?: boolean;
  /** Link these docs pages, by address. */
  readonly pages?: readonly string[];
  /** Offer the example questions after the reply. */
  readonly suggest?: boolean;
}

/** Make a set from a space-separated list of words. */
function words(list: string): ReadonlySet<string> {
  return new Set(list.split(' '));
}

const greetings = words('hi hello hey hiya howdy yo gm greetings morning afternoon evening');
const farewells = words('bye goodbye byebye cya farewell gn');
/** Words that end a conversation only in a very short message, as in "good night". */
const shortFarewells = words('later night');
const thankWords = words('thanks thank thx ty cheers appreciate appreciated');
const compliments = words(
  'awesome amazing great love nice excellent fantastic brilliant impressive perfect ' +
    'wonderful neat helpful useful beautiful rock rocks legend',
);
const acknowledgments = words(
  'ok okay k kk cool got gotcha sure alright fine lol haha lmao hmm meh',
);
const complaints = words(
  'sucks suck useless stupid dumb terrible awful hate worst bad wrong garbage trash ' +
    'unhelpful annoying broken',
);
const negations = words('not no never isnt dont doesnt cant wont');
const licenseWords = words('license licence licensing free cost costs price pricing paid pay mit');
const commercialWords = words('commercial commercially');
const stabilityWords = words(
  'stable stability production alpha beta version versions release releases roadmap changelog',
);
const githubWords = words(
  'bug bugs issue issues problem problems report contribute contributing contributor ' +
    'contributors github repo repository maintain maintains maintainer maintainers author ' +
    'authors creator',
);
const valueWords = words('better compare comparison vs versus alternative alternatives benefits');

/** Report whether any token is in a word set. */
function hasAny(tokens: readonly string[], set: ReadonlySet<string>): boolean {
  return tokens.some(
    /** Check one token. */
    (token) => set.has(token),
  );
}

/** Report whether two words appear in order, one right after the other. */
function hasPair(tokens: readonly string[], first: string, second: string): boolean {
  return tokens.some(
    /** Check one position. */
    (token, position) => token === first && tokens[position + 1] === second,
  );
}

/** The reply to "ok", "cool", or a thumbs-up. */
export const acknowledgment: Intent = {
  kind: 'acknowledgment',
  text: 'Anything else I can help with?',
};

/** A message short enough to be small talk rather than a question. */
const smallTalkLength = 5;

/** The social replies, for short messages that do not name a Lever UI topic. */
function socialIntent(message: MessageWords): Intent | undefined {
  const { tokens, toAssistant } = message;
  if (tokens.length > smallTalkLength) return undefined;
  const negated = hasAny(tokens, negations);
  if (hasAny(tokens, complaints) || (negated && hasAny(tokens, compliments))) {
    if (toAssistant) return undefined;
    return {
      kind: 'complaint',
      text:
        'Sorry that did not help. Try naming a component, or what you want to build, like ' +
        'a date picker or a dark mode switch.',
      suggest: true,
    };
  }
  if (hasAny(tokens, thankWords)) {
    return { kind: 'thanks', text: 'You are welcome. Ask me anything else.' };
  }
  const veryShort = tokens.length <= 3;
  if (
    hasAny(tokens, farewells) ||
    (veryShort && (hasAny(tokens, shortFarewells) || hasPair(tokens, 'see', 'you')))
  ) {
    return { kind: 'farewell', text: 'Bye for now. Come back any time you have a question.' };
  }
  const asksHowItIs =
    (tokens.includes('how') && hasAny(tokens, words('you going day doing'))) ||
    hasPair(tokens, 'whats', 'up') ||
    hasPair(tokens, 'what', 'up') ||
    tokens.includes('sup');
  if (asksHowItIs) {
    return {
      kind: 'smallTalk',
      text: 'I am doing well, thanks for asking. What would you like to know about Lever UI?',
    };
  }
  if ((tokens[0] && greetings.has(tokens[0])) || (veryShort && hasAny(tokens, greetings))) {
    return {
      kind: 'greeting',
      text: 'Hi! Ask me about any Lever UI component, theming, or setup.',
    };
  }
  if (hasAny(tokens, compliments)) {
    return { kind: 'compliment', text: 'Thank you! What else would you like to know?' };
  }
  const onlyAcknowledges = tokens.every(
    /** Check that every word just acknowledges, like "ok" or "cool". */
    (token) => acknowledgments.has(token) || token === 'it' || token === 'that',
  );
  return onlyAcknowledges ? acknowledgment : undefined;
}

/** The replies about the project: its license, its stability, GitHub, and why to use it. */
function projectIntent(message: MessageWords): Intent | undefined {
  const { tokens } = message;
  const openSource = hasPair(tokens, 'open', 'source');
  if (hasAny(tokens, licenseWords) || hasAny(tokens, commercialWords) || openSource) {
    return {
      kind: 'license',
      text:
        'Lever UI is free and open source under the MIT license, so you can use it in ' +
        'personal and commercial projects.',
      github: true,
    };
  }
  const asksWhatsNew = hasPair(tokens, 'whats', 'new') || hasPair(tokens, 'what', 'new');
  if (hasAny(tokens, stabilityWords) || hasPair(tokens, 'production', 'ready') || asksWhatsNew) {
    return {
      kind: 'stability',
      text: 'Lever UI is in alpha, so its APIs may still change before version 1.0.',
      pages: ['/docs/getting-started'],
    };
  }
  if (hasAny(tokens, githubWords) || hasPair(tokens, 'source', 'code')) {
    return {
      kind: 'github',
      text: 'The code is on GitHub. Please open an issue for a bug, or a pull request to help out.',
      github: true,
    };
  }
  const asksWhy = tokens.includes('why') && hasAny(tokens, words('use choose pick should lever'));
  if (!message.onTopic && (asksWhy || hasAny(tokens, valueWords))) {
    return {
      kind: 'value',
      text:
        'Lever UI gives you accessible SolidJS components that you style with plain CSS, ' +
        'with server rendering built in and no style runtime.',
      pages: ['/docs/getting-started', '/docs/components/concepts/overview', '/docs/theme-guide'],
    };
  }
  return undefined;
}

/** Recognize small talk or a question about the project. */
export function recognizeIntent(message: MessageWords): Intent | undefined {
  const project = projectIntent(message);
  if (project) return project;
  return message.onTopic ? undefined : socialIntent(message);
}
