declare module '*.css';

/** Expose authored stylesheet source to the token documentation examples. */
declare module '*.css?raw' {
  const content: string;
  export default content;
}

/** Expose maintained TSX example source for copyable website Code panels. */
declare module '*.tsx?raw' {
  const content: string;
  export default content;
}
