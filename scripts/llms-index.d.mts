/** One guide in an index section. */
export interface LlmsGuide {
  /** The guide's Markdown. */
  readonly content: string;
  /** Where the guide is: a relative path or a full address. */
  readonly href: string;
  /** A title that replaces the guide's own heading. */
  readonly title?: string;
}

/** A titled group of guides. */
export interface LlmsSection {
  readonly title: string;
  readonly guides: readonly LlmsGuide[];
}

/** Read a guide's title and the first sentence of its first paragraph. */
export function describeGuide(content: string): { title: string; summary: string };

/** Format the index from an introduction and sections of guides. */
export function formatLlmsIndex(introduction: string, sections: readonly LlmsSection[]): string;
