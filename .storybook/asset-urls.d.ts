/** Resolve Storybook's SVG URL imports as typed strings. */
declare module '*.svg?url' {
  const url: string;
  export default url;
}
