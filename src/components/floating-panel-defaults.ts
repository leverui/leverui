import type { UseFloatingPanelProps } from './floating-panel-machine';

const machineDefaultNames = new Set<keyof UseFloatingPanelProps>([
  'allowOverflow',
  'closeOnEscape',
  'defaultOpen',
  'defaultPosition',
  'defaultSize',
  'dir',
  'disabled',
  'draggable',
  'getAnchorPosition',
  'getBoundaryEl',
  'gridSize',
  'finalFocusEl',
  'id',
  'ids',
  'initialFocusEl',
  'lockAspectRatio',
  'maxSize',
  'minSize',
  'onOpenChange',
  'onPositionChange',
  'onPositionChangeEnd',
  'onSizeChange',
  'onSizeChangeEnd',
  'onStageChange',
  'open',
  'persistRect',
  'position',
  'resizable',
  'restoreFocus',
  'size',
  'strategy',
  'translations',
]);

/** Retain appearance and presence defaults without replacing an external machine. */
export function floatingPanelProviderDefaults<Props extends object>(
  defaults: Props,
): Partial<Props> {
  const inherited = { ...defaults };
  for (const name of machineDefaultNames) Reflect.deleteProperty(inherited, name);
  return inherited;
}
