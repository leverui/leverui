import type {
  FloatingPanelResizeTriggerProps as PrimitiveResizeTriggerProps,
  FloatingPanelStageTriggerProps as PrimitiveStageTriggerProps,
} from '../primitives/components/floating-panel';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { floatingPanelPartTags, FloatingPanelPartSlot } from './floating-panel-part-registry';

type PartBehavior<Slot extends FloatingPanelPartSlot> = Slot extends 'resizeTrigger'
  ? Pick<PrimitiveResizeTriggerProps, 'placement'>
  : Slot extends 'stageTrigger'
    ? Pick<PrimitiveStageTriggerProps, 'stage'>
    : object;

export type FloatingPanelPartProps<
  Slot extends FloatingPanelPartSlot,
  As extends PrimitiveNativeTag = (typeof floatingPanelPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof floatingPanelPartTags)[Slot],
  PartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type FloatingPanelTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  FloatingPanelPartProps<'trigger', As>;
export type FloatingPanelPositionerProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'positioner', As>;
export type FloatingPanelContentProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'content', As>;
export type FloatingPanelHeaderProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'header', As>;
export type FloatingPanelBodyProps<As extends PrimitiveNativeTag = 'div'> = FloatingPanelPartProps<
  'body',
  As
>;
export type FloatingPanelTitleProps<As extends PrimitiveNativeTag = 'h2'> = FloatingPanelPartProps<
  'title',
  As
>;
export type FloatingPanelDragTriggerProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'dragTrigger', As>;
export type FloatingPanelResizeTriggerProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'resizeTrigger', As>;
export type FloatingPanelStageTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  FloatingPanelPartProps<'stageTrigger', As>;
export type FloatingPanelCloseTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  FloatingPanelPartProps<'closeTrigger', As>;
export type FloatingPanelControlProps<As extends PrimitiveNativeTag = 'div'> =
  FloatingPanelPartProps<'control', As>;

type GeneratedResizeProps<Props> = Props extends unknown ? Omit<Props, 'placement'> : never;

export type FloatingPanelResizeTriggersProps<As extends PrimitiveNativeTag = 'div'> =
  GeneratedResizeProps<FloatingPanelResizeTriggerProps<As>> & {
    /** The edges and corners that get a resize handle; all eight by default. */
    axes?: readonly PrimitiveResizeTriggerProps['placement'][];
  };
