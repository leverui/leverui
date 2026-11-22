import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import { mergeRecipeProps } from './recipe-props-merge';
import type { TabsAppearance } from './tabs-appearance';
import type { UseTabsProps, UseTabsReturn } from './tabs-machine';

type TabsRenderProps = {
  lazyMount?: boolean | undefined;
  unmountOnExit?: boolean | undefined;
};
export type TabsRootBaseProps = UseTabsProps &
  TabsRenderProps &
  PrimitiveCompositionProps<'div'> &
  TabsAppearance;
export type TabsRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  UseTabsProps & TabsRenderProps & TabsAppearance & NativeHtmlAliases,
  As
>;
export type TabsRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<
    'div',
    { value: UseTabsReturn } & TabsRenderProps & TabsAppearance & NativeHtmlAliases,
    As
  >;
export type TabsDefaults = Partial<TabsRootBaseProps>;

export interface TabsPropsProviderProps {
  value: TabsDefaults | Accessor<TabsDefaults>;
  children: JSX.Element;
}

const TabsPropsContext = createOptionalContext<Accessor<TabsDefaults>>();
const machinePropNames = [
  'activationMode',
  'defaultValue',
  'deselectable',
  'id',
  'ids',
  'loopFocus',
  'navigate',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'translations',
  'value',
  'virtualFocus',
] as const satisfies readonly (keyof UseTabsProps)[];

/** Defaults left once owned-machine props are removed. */
type ProviderDefaults = Omit<TabsDefaults, (typeof machinePropNames)[number]>;

/** Keep owned-machine defaults off a caller-owned Tabs accessor. */
function providerDefaults(defaults: TabsDefaults): ProviderDefaults {
  const inherited = { ...defaults };
  for (const name of machinePropNames) delete inherited[name];
  return inherited;
}

/** Supply reactive machine and appearance defaults to nested Tabs roots. */
export function TabsPropsProvider(props: TabsPropsProviderProps): JSX.Element {
  /** Read a static defaults value or the caller's live Solid accessor. */
  function readDefaults(): TabsDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <TabsPropsContext value={readDefaults}>{props.children}</TabsPropsContext>;
}

/** Apply provider defaults before creating an owned Tabs machine. */
export function useTabsRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(TabsPropsContext);
  return mergeRecipeProps<Props>(
    /** Let local props override current provider defaults. */
    () => (inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}

/** Inherit appearance while preserving the caller's external machine. */
export function useTabsRootProviderProps<Props extends TabsAppearance & { value: UseTabsReturn }>(
  instance: Props,
): Props {
  const inherited = useOptionalContext(TabsPropsContext);
  return mergeRecipeProps<Props>(
    /** Drop machine props before merging presentation defaults. */
    () => providerDefaults(inherited?.() ?? {}) as Partial<Props>,
    instance,
  );
}
