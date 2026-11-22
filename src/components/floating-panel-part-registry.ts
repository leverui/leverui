import { FloatingPanel as PrimitiveFloatingPanel } from '../primitives/components/floating-panel';

/** Bind public slots to the native elements actually rendered by the primitive Solid. */
export const floatingPanelPartTags = {
  trigger: 'button',
  positioner: 'div',
  content: 'div',
  header: 'div',
  body: 'div',
  title: 'h2',
  dragTrigger: 'div',
  resizeTrigger: 'div',
  stageTrigger: 'button',
  closeTrigger: 'button',
  control: 'div',
} as const;

export type FloatingPanelPartSlot = keyof typeof floatingPanelPartTags;

/** Keep the primitive's machine-owned parts at the single rendering boundary. */
export const floatingPanelPartComponents = {
  trigger: PrimitiveFloatingPanel.Trigger,
  positioner: PrimitiveFloatingPanel.Positioner,
  content: PrimitiveFloatingPanel.Content,
  header: PrimitiveFloatingPanel.Header,
  body: PrimitiveFloatingPanel.Body,
  title: PrimitiveFloatingPanel.Title,
  dragTrigger: PrimitiveFloatingPanel.DragTrigger,
  resizeTrigger: PrimitiveFloatingPanel.ResizeTrigger,
  stageTrigger: PrimitiveFloatingPanel.StageTrigger,
  closeTrigger: PrimitiveFloatingPanel.CloseTrigger,
  control: PrimitiveFloatingPanel.Control,
} as const;
