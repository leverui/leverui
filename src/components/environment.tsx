import {
  EnvironmentProvider as PrimitiveEnvironmentProvider,
  useEnvironmentContext as usePrimitiveEnvironmentContext,
} from '../primitives/providers/environment';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type RootNode = Document | ShadowRoot | Node;

export interface EnvironmentContext {
  /** Resolve the current application root. */
  getRootNode(): RootNode;
  /** Resolve the document that owns the application root. */
  getDocument(): Document;
  /** Resolve the window that owns the application root. */
  getWindow(): Window & typeof globalThis;
}

export interface EnvironmentProviderProps {
  /** Content that shares this DOM environment. */
  children?: JSX.Element | undefined;
  /** Explicit root or a function that reads a changing root. */
  value?: RootNode | (() => RootNode) | undefined;
}

/** Provide one DOM root to Lever UI and primitive-backed descendants. */
export function EnvironmentProvider(props: EnvironmentProviderProps): JSX.Element {
  return createComponent(PrimitiveEnvironmentProvider, {
    /** Keep the primitive root responsive to a changing Solid prop. */
    get value() {
      return props.value;
    },
    /** Resolve descendants inside the primitive's environment context. */
    get children() {
      return props.children;
    },
  });
}

/** Read the nearest environment as a Solid accessor. */
export function useEnvironmentContext(): Accessor<EnvironmentContext> {
  return usePrimitiveEnvironmentContext();
}
