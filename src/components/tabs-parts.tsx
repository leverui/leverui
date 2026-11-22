import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderTabsPart } from './tabs-part';
import type {
  TabsContentGroupProps,
  TabsContentProps,
  TabsIndicatorProps,
  TabsListProps,
  TabsTriggerProps,
} from './tabs-part-props';

/** Render the primitive's tab list with authored CSS hooks. */
export function TabsList<As extends PrimitiveNativeTag = 'div'>(
  props: TabsListProps<As>,
): JSX.Element {
  return renderTabsPart('list', props);
}

/** Render a tab trigger with the primitive selection and disabled state. */
export function TabsTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: TabsTriggerProps<As>,
): JSX.Element {
  return renderTabsPart('trigger', props);
}

/** Render a selected panel with the primitive presence and lazy mounting. */
export function TabsContent<As extends PrimitiveNativeTag = 'div'>(
  props: TabsContentProps<As>,
): JSX.Element {
  return renderTabsPart('content', props);
}

/** Group panels in the optional content-group part. */
export function TabsContentGroup<As extends PrimitiveNativeTag = 'div'>(
  props: TabsContentGroupProps<As>,
): JSX.Element {
  return renderTabsPart('contentGroup', props);
}

/** Render the primitive's indicator against the selected trigger. */
export function TabsIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: TabsIndicatorProps<As>,
): JSX.Element {
  return renderTabsPart('indicator', props);
}
