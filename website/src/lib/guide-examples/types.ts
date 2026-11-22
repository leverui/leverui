/** One Storybook example's place on its component guide. */
export interface GuideExample {
  /** Export name in the guide's Storybook examples file. */
  readonly id: string;
  /** Reference-page heading shown instead of the story's own name. */
  readonly title?: string;
  /** Keep a Storybook-only demo off the guide. */
  readonly omit?: true;
}

/**
 * Guide examples keyed by guide slug, listed in page order.
 * Stories without an entry follow the listed ones in authored order.
 */
export type GuideExampleMap = Readonly<Record<string, readonly GuideExample[]>>;
