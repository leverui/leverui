import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ResponsiveBadgeSize } from './badge-size';
import type { BadgeVariant } from './badge-props';
import type { NativeElementTag } from './native-element-props';

export interface CodeBaseProps {
  /** Choose one of Code's authored sizes at ordinary breakpoints. */
  size?: ResponsiveBadgeSize | undefined;
  /** Choose an authored Badge treatment for inline code. */
  variant?: BadgeVariant | undefined;
  /** Select a built-in or consumer-defined palette. */
  colorPalette?: string | undefined;
  /** Suppress the default Code presentation. */
  unstyled?: boolean | undefined;
  /** Preserve Solid's supported className alias alongside class. */
  className?: string | undefined;
}

export type CodeRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref' | keyof CodeBaseProps> &
  CodeBaseProps & {
    as?: NativeElementTag;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type CodeDefaults = Partial<Omit<CodeRootProps, 'as' | 'asChild' | 'children' | 'ref'>>;

export interface CodePropsProviderProps {
  value: CodeDefaults | Accessor<CodeDefaults>;
  children: JSX.Element;
}

const CodeContext = createOptionalContext<Accessor<CodeDefaults>>();

/** Supply reactive Code appearance and native attribute defaults. */
export function CodePropsProvider(props: CodePropsProviderProps): JSX.Element {
  /** Read current defaults when a descendant consumes a property. */
  function readDefaults(): CodeDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <CodeContext value={readDefaults}>{props.children}</CodeContext>;
}

/** Compose provider defaults with the live instance props and classes. */
export function useCodeProps(instance: CodeRootProps): CodeRootProps {
  const inherited = useOptionalContext(CodeContext);
  return mergeProps(
    /** Track changes to the nearest provider while reading Code props. */
    () => inherited?.() ?? {},
    instance,
  );
}
