import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { PolymorphicProps } from '../primitives/components/factory';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { CodeBlockAppearance } from './code-block-appearance';
import type { CodeBlockColorScheme, CodeBlockHighlighterProps } from './code-block-types';

export type CodeBlockRootBaseProps = CodeBlockAppearance &
  CodeBlockHighlighterProps & {
    maxLines?: number | undefined;
    contentId?: string | undefined;
    defaultColorScheme?: CodeBlockColorScheme | undefined;
    copyTimeout?: number | undefined;
    /** Notify consumers after the browser confirms a copy. */
    onCopy?: (() => void) | undefined;
  };

export type CodeBlockRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  CodeBlockRootBaseProps & { children: JSX.Element; className?: string | undefined },
  As
>;
export type CodeBlockRootInstanceProps = Omit<
  CodeBlockRootProps,
  'children' | 'as' | 'asChild' | 'ref'
> & {
  ref?: unknown;
  as?: PrimitiveNativeTag | undefined;
  asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
};
/** Share root defaults while each instance owns its ref and asChild renderer. */
type CodeBlockRootDefaults = Partial<Omit<CodeBlockRootInstanceProps, 'ref' | 'asChild'>>;

type PartProps<
  Tag extends PrimitiveNativeTag,
  As extends PrimitiveNativeTag = Tag,
> = PrimitiveNativeElementProps<
  Tag,
  { unstyled?: boolean | undefined; className?: string | undefined },
  As
>;

export type CodeBlockContentProps = Omit<PartProps<'div'>, 'id'>;
export type CodeBlockHeaderProps = PartProps<'header'>;
export type CodeBlockTitleProps = PartProps<'div'>;
export type CodeBlockCodeProps = PartProps<'pre'>;
export type CodeBlockCodeTextProps = Omit<
  JSX.IntrinsicElements['code'],
  'as' | 'asChild' | 'ref'
> & {
  unstyled?: boolean | undefined;
  className?: string | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: NonNullable<PolymorphicProps<'code'>['asChild']> | undefined;
  ref?: ((element: Element) => void) | undefined;
};
export type CodeBlockCopyTriggerProps = PartProps<'button'>;
export type CodeBlockCopyIndicatorProps = PartProps<'span'> & { copied?: JSX.Element };
export type CodeBlockCollapseTriggerProps = PartProps<'button'>;
export type CodeBlockCollapseIndicatorProps = PartProps<'span'> & { collapsed?: JSX.Element };
export type CodeBlockCollapseTextProps = PartProps<'span'>;
export type CodeBlockFooterProps = PartProps<'div'>;
export type CodeBlockControlProps = PartProps<'div'>;
export type CodeBlockOverlayProps = PartProps<'div'>;

export interface CodeBlockPropsProviderProps {
  value: CodeBlockRootDefaults | Accessor<CodeBlockRootDefaults>;
  children: JSX.Element;
}

const PropsContext = createOptionalContext<Accessor<CodeBlockRootDefaults>>();

/** Supply reactive Code Block defaults to descendant roots. */
export function CodeBlockPropsProvider(props: CodeBlockPropsProviderProps): JSX.Element {
  /** Resolve static or accessor defaults inside a descendant's tracked scope. */
  function readDefaults(): CodeBlockRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <PropsContext value={readDefaults}>{props.children}</PropsContext>;
}

/** Merge nearest provider defaults with live Code Block root props. */
export function useCodeBlockProps(
  instance: CodeBlockRootInstanceProps,
): CodeBlockRootInstanceProps {
  const inherited = useOptionalContext(PropsContext);
  return mergeRecipeProps<CodeBlockRootInstanceProps>(
    /** Let explicit root values take precedence over inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
