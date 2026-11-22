import type { PolymorphicProps } from '../primitives/components/factory';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import { omit } from '../utils/omit';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type {
  SplitterPanelMachineProps,
  SplitterResizeTriggerMachineProps,
  UseSplitterProps,
  UseSplitterReturn,
} from './splitter-types';
import type { ClassValue } from '../utils/class-value';

export type SplitterRootBaseProps = UseSplitterProps &
  PrimitiveCompositionProps<'div'> & { unstyled?: boolean };
export type SplitterRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  SplitterRootBaseProps & NativeHtmlAliases,
  As
>;
export type SplitterRootProviderBaseProps = PrimitiveCompositionProps<'div'> & {
  unstyled?: boolean;
  value: UseSplitterReturn;
};
export type SplitterRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', SplitterRootProviderBaseProps & NativeHtmlAliases, As>;
export type SplitterPanelProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  SplitterPanelMachineProps & { unstyled?: boolean } & NativeHtmlAliases,
  As
>;
export type SplitterResizeTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<
    'button',
    SplitterResizeTriggerMachineProps & { unstyled?: boolean } & NativeHtmlAliases,
    As
  >;
export type SplitterResizeTriggerIndicatorProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { unstyled?: boolean } & NativeHtmlAliases, As>;
export type SplitterResizeTriggerSeparatorProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { unstyled?: boolean } & NativeHtmlAliases, As>;

export type SplitterRuntimeRootProps = UseSplitterProps &
  NativeHtmlAliases & {
    unstyled?: boolean | undefined;
    class?: ClassValue | undefined;
    className?: string | undefined;
    style?: JSX.CSSProperties | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
export type SplitterRuntimeProviderProps = Omit<
  SplitterRuntimeRootProps,
  keyof UseSplitterProps
> & { value: UseSplitterReturn };
export type SplitterRuntimePartProps<Tag extends 'div' | 'button'> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  'aria-label'?: string | false | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.CSSProperties | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

type SplitterDefaults = Partial<Omit<SplitterRootBaseProps, 'children' | 'ref' | 'asChild'>> &
  Omit<JSX.HTMLAttributes<HTMLElement>, 'children'>;

export interface SplitterPropsProviderProps {
  value: SplitterDefaults | Accessor<SplitterDefaults>;
  children: JSX.Element;
}

const SplitterPropsContext = createOptionalContext<Accessor<SplitterDefaults>>();
const rootMachineKeys = [
  'defaultSize',
  'ids',
  'keyboardResizeBy',
  'onCollapse',
  'onExpand',
  'onResize',
  'onResizeEnd',
  'onResizeStart',
  'orientation',
  'panels',
  'registry',
  'size',
] as const;

/** Supply reactive Splitter defaults without owning each root's machine. */
export function SplitterPropsProvider(props: SplitterPropsProviderProps): JSX.Element {
  /** Read either static defaults or a Solid accessor. */
  function readDefaults(): SplitterDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <SplitterPropsContext value={readDefaults}>{props.children}</SplitterPropsContext>;
}

/** Merge inherited Splitter defaults with live root props. */
export function useSplitterProps(instance: SplitterRuntimeRootProps): SplitterRuntimeRootProps {
  const inherited = useOptionalContext(SplitterPropsContext);
  return mergeProps(
    /** Follow provider changes without replacing the primitive's machine. */
    () => inherited?.() ?? {},
    instance,
  ) as SplitterRuntimeRootProps;
}

/** Apply shared defaults without forwarding machine props to an external store root. */
export function useSplitterRootProviderProps(
  instance: SplitterRuntimeProviderProps,
): SplitterRuntimeProviderProps {
  const inherited = useOptionalContext(SplitterPropsContext);
  return mergeProps(
    /** Keep styling and native defaults while the external store owns machine state. */
    () => omit(inherited?.() ?? {}, rootMachineKeys),
    instance,
  ) as SplitterRuntimeProviderProps;
}
