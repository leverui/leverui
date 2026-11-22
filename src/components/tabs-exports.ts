export * as Tabs from './tabs';
export { TabsRoot, TabsRootProvider } from './tabs-root';
export { TabsPropsProvider } from './tabs-props';
export { TabsList, TabsTrigger, TabsContent, TabsContentGroup, TabsIndicator } from './tabs-parts';
export { TabsContext, useTabs, useTabsContext } from './tabs-machine';
export type {
  TabsRootBaseProps,
  TabsRootProps,
  TabsRootProviderProps,
  TabsPropsProviderProps,
} from './tabs-props';
export type {
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsContentGroupProps,
  TabsIndicatorProps,
} from './tabs-part-props';
export type {
  TabsFocusChangeDetails,
  TabsValueChangeDetails,
  UseTabsProps,
  UseTabsReturn,
} from './tabs-machine';
