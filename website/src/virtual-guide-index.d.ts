/** Every guide's title, address, and kind, built from the Markdown by `guideIndexPlugin`. */
declare module 'virtual:guide-index' {
  export const guideIndex: readonly {
    readonly title: string;
    readonly path: string;
    readonly kind: 'overview' | 'component' | 'concept' | 'reference';
  }[];
}
