import {
  SplitterContext as PrimitiveContext,
  createSplitterRegistry as createPrimitiveRegistry,
  useSplitter as usePrimitiveSplitter,
  useSplitterContext as usePrimitiveSplitterContext,
} from '../primitives/components/splitter';
import { layout } from '@zag-js/splitter';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  SplitterContextProps,
  SplitterRegistryProps,
  SplitterRegistryReturn,
  UseSplitterContext,
  UseSplitterProps,
  UseSplitterReturn,
} from './splitter-types';

/** Create a primitive Splitter machine with Lever UI's public type contract. */
export function useSplitter(
  props: UseSplitterProps | Accessor<UseSplitterProps>,
): UseSplitterReturn {
  return usePrimitiveSplitter(props);
}

/** Read the closest primitive Splitter machine as a Solid accessor. */
export function useSplitterContext(): UseSplitterContext {
  return usePrimitiveSplitterContext();
}

/** Supply the primitive's machine accessor to a child render callback. */
export function SplitterContext(props: SplitterContextProps): JSX.Element {
  return createComponent(PrimitiveContext, props);
}

/** Create a shared Zag Splitter registry for nested layouts. */
export function createSplitterRegistry(props?: SplitterRegistryProps): SplitterRegistryReturn {
  return createPrimitiveRegistry(props);
}

export { layout as getSplitterLayout };
