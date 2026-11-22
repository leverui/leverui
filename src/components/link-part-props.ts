import { type JSX } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementTag } from './native-element-props';

export interface LinkPartOptions {
  /** Suppress authored LinkBox or LinkOverlay presentation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's className alias alongside class. */
  className?: string | undefined;
}

export type LinkPartRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof LinkPartOptions
> &
  LinkPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
