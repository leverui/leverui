import { splitProps } from '../primitives/utils/split-props';
import { For, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useDatePickerContext } from './date-picker-machine';
import type { DatePickerTableProps, DatePickerViewControlProps } from './date-picker-part-props';
import {
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerViewTrigger,
} from './date-picker-parts-field';
import {
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerWeekNumberCell,
  DatePickerWeekNumberCellText,
  DatePickerWeekNumberHeaderCell,
} from './date-picker-parts-table';
import { DatePickerViewControl } from './date-picker-parts-field';

export type DatePickerHeaderProps<As extends ComponentIntrinsicElement = 'div'> =
  DatePickerViewControlProps<As>;
export type DatePickerDayTableProps<As extends ComponentIntrinsicElement = 'table'> =
  DatePickerTableProps<As> & { offset?: number; weekNumberLabel?: string };

const NativeTable: Component<DatePickerTableProps> = DatePickerTable;
const NativeViewControl: Component<DatePickerViewControlProps> = DatePickerViewControl;

/** Compose previous, current-range, and next controls for a calendar view. */
function DatePickerHeaderImpl(props: DatePickerHeaderProps): JSX.Element {
  return (
    <NativeViewControl {...props}>
      <DatePickerPrevTrigger />
      <DatePickerViewTrigger>
        <DatePickerRangeText />
      </DatePickerViewTrigger>
      <DatePickerNextTrigger />
    </NativeViewControl>
  );
}

/** Preserve native element selection for the composed header. */
export const DatePickerHeader = DatePickerHeaderImpl as <
  As extends ComponentIntrinsicElement = 'div',
>(
  props: DatePickerHeaderProps<As>,
) => JSX.Element;

/** Render a reactive day grid, optionally offset to another visible month. */
function DatePickerDayTableImpl(props: DatePickerDayTableProps): JSX.Element {
  const [local, tableProps] = splitProps(props, ['offset', 'weekNumberLabel', 'children']);
  const datePicker = useDatePickerContext();

  /** Read an offset month only when the caller selects one. */
  function offsetMonth() {
    return local.offset ? datePicker().getOffset({ months: local.offset }) : undefined;
  }

  /** Recompute the displayed weeks when navigation or locale changes. */
  function displayedWeeks() {
    return offsetMonth()?.weeks ?? datePicker().weeks;
  }

  return (
    <NativeTable {...tableProps}>
      <DatePickerTableHead>
        <DatePickerTableRow>
          <Show when={datePicker().showWeekNumbers}>
            <DatePickerWeekNumberHeaderCell>
              {local.weekNumberLabel ?? '#'}
            </DatePickerWeekNumberHeaderCell>
          </Show>
          <For each={datePicker().weekDays}>
            {
              /** Preserve the machine's locale-specific weekday order. */
              (weekDay) => <DatePickerTableHeader>{weekDay.narrow}</DatePickerTableHeader>
            }
          </For>
        </DatePickerTableRow>
      </DatePickerTableHead>
      <DatePickerTableBody>
        <For each={displayedWeeks()}>
          {
            /** Bind each visible week to its date and week-number cells. */
            (week, weekIndex) => (
              <DatePickerTableRow>
                <Show when={datePicker().showWeekNumbers}>
                  <DatePickerWeekNumberCell weekIndex={weekIndex()} week={week}>
                    <DatePickerWeekNumberCellText>
                      {datePicker().getWeekNumber(week)}
                    </DatePickerWeekNumberCellText>
                  </DatePickerWeekNumberCell>
                </Show>
                <For each={week}>
                  {
                    /** Keep the day value and visible range on the owning cell. */
                    (day) => (
                      <DatePickerTableCell value={day} visibleRange={offsetMonth()?.visibleRange}>
                        <DatePickerTableCellTrigger>{day.day}</DatePickerTableCellTrigger>
                      </DatePickerTableCell>
                    )
                  }
                </For>
              </DatePickerTableRow>
            )
          }
        </For>
      </DatePickerTableBody>
    </NativeTable>
  );
}

/** Preserve native element selection for the composed day grid. */
export const DatePickerDayTable = DatePickerDayTableImpl as <
  As extends ComponentIntrinsicElement = 'table',
>(
  props: DatePickerDayTableProps<As>,
) => JSX.Element;
