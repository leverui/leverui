import type {
  DatePickerInputProps as PrimitiveInputProps,
  DatePickerPresetTriggerProps as PrimitivePresetTriggerProps,
  DatePickerTableCellProps as PrimitiveTableCellProps,
  DatePickerTableProps as PrimitiveTableProps,
  DatePickerValueTextProps as PrimitiveValueTextProps,
  DatePickerViewProps as PrimitiveViewProps,
  DatePickerWeekNumberCellProps as PrimitiveWeekNumberCellProps,
} from '../primitives/components/date-picker';
import type { DatePickerPartSlot } from './date-picker-part-registry';

/** Preserve required machine settings on the part that consumes each one. */
export type DatePickerPartBehavior<Slot extends DatePickerPartSlot> = Slot extends 'input'
  ? Pick<PrimitiveInputProps, 'index' | 'fixOnBlur'>
  : Slot extends 'presetTrigger'
    ? Pick<PrimitivePresetTriggerProps, 'value'>
    : Slot extends 'table'
      ? Pick<PrimitiveTableProps, 'columns'>
      : Slot extends 'tableCell'
        ? Pick<PrimitiveTableCellProps, 'disabled' | 'value' | 'visibleRange' | 'columns'>
        : Slot extends 'valueText'
          ? Pick<PrimitiveValueTextProps, 'placeholder' | 'separator' | 'children'>
          : Slot extends 'view'
            ? Pick<PrimitiveViewProps, 'view'>
            : Slot extends 'weekNumberCell'
              ? Pick<PrimitiveWeekNumberCellProps, 'weekIndex' | 'week'>
              : object;
