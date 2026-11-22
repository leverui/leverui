export { TabsRoot as Root, TabsRootProvider as RootProvider } from './tabs-root';
export { TabsPropsProvider as PropsProvider } from './tabs-props';
export {
  TabsList as List,
  TabsTrigger as Trigger,
  TabsContent as Content,
  TabsContentGroup as ContentGroup,
  TabsIndicator as Indicator,
} from './tabs-parts';
export { TabsContext as Context, useTabs, useTabsContext } from './tabs-machine';
export type {
  TabsRootBaseProps as RootBaseProps,
  TabsRootProps as RootProps,
  TabsRootProviderProps as RootProviderProps,
  TabsPropsProviderProps as PropsProviderProps,
} from './tabs-props';
export type {
  TabsListProps as ListProps,
  TabsTriggerProps as TriggerProps,
  TabsContentProps as ContentProps,
  TabsContentGroupProps as ContentGroupProps,
  TabsIndicatorProps as IndicatorProps,
} from './tabs-part-props';
export type {
  TabsFocusChangeDetails as FocusChangeDetails,
  TabsValueChangeDetails as ValueChangeDetails,
  UseTabsProps,
  UseTabsReturn,
} from './tabs-machine';
