import {
  ProgressContext as PrimitiveContext,
  useProgress as usePrimitiveProgress,
  useProgressContext as usePrimitiveProgressContext,
} from '../primitives/components/progress';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  ProgressContextProps,
  UseProgressContext,
  UseProgressProps,
  UseProgressReturn,
} from './progress-types';

/** Create the primitive's Zag Progress machine behind a Lever UI hook. */
export function useProgress(
  props?: UseProgressProps | Accessor<UseProgressProps>,
): UseProgressReturn {
  return usePrimitiveProgress(props);
}

/** Read the nearest primitive Progress machine as a Solid accessor. */
export function useProgressContext(): UseProgressContext {
  return usePrimitiveProgressContext();
}

/** Supply the Progress machine to a child render callback. */
export function ProgressContext(props: ProgressContextProps): JSX.Element {
  return createComponent(PrimitiveContext, props);
}
