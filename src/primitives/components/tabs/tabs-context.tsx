import { type JSX } from '@solidjs/web';
import { type UseTabsContext, useTabsContext } from './use-tabs-context';

export interface TabsContextProps {
  children: (context: UseTabsContext) => JSX.Element;
}

/** Render the Tabs context context through a function child. */
export const TabsContext = (props: TabsContextProps) => props.children(useTabsContext());
