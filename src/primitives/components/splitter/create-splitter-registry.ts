import * as splitter from '@zag-js/splitter';

export type SplitterRegistryProps = splitter.SplitterRegistryOptions;

export type SplitterRegistryReturn = splitter.SplitterRegistry;

/** Create a splitter registry. */
export const createSplitterRegistry = (
  props?: splitter.SplitterRegistryOptions,
): splitter.SplitterRegistry => {
  return splitter.registry(props);
};
