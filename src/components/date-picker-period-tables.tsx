import { splitProps } from '../primitives/utils/split-props';
import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useDatePickerContext } from './date-picker-machine';
import type { DatePickerTableProps } from './date-picker-part-props';
import {
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableRow,
} from './date-picker-parts-table';

export type DatePickerMonthTableProps<As extends ComponentIntrinsicElement = 'table'> =
  DatePickerTableProps<As> & { columns?: number; format?: 'short' | 'long' };
export type DatePickerYearTableProps<As extends ComponentIntrinsicElement = 'table'> =
  DatePickerTableProps<As> & { columns?: number };

const NativeTable: Component<DatePickerTableProps> = DatePickerTable;

/** Render the localized month grid for the active calendar view. */
function DatePickerMonthTableImpl(props: DatePickerMonthTableProps): JSX.Element {
  const [local, tableProps] = splitProps(props, ['columns', 'format', 'children']);
  const datePicker = useDatePickerContext();

  /** Rebuild month rows when the date machine or display format changes. */
  function monthRows() {
    return datePicker().getMonthsGrid({
      columns: local.columns ?? 4,
      format: local.format ?? 'short',
    });
  }

  return (
    <NativeTable {...tableProps}>
      <DatePickerTableBody>
        <For each={monthRows()}>
          {
            /** Preserve machine-generated month row order. */
            (months) => (
              <DatePickerTableRow>
                <For each={months}>
                  {
                    /** Pair each month label with its selectable calendar value. */
                    (month) => (
                      <DatePickerTableCell value={month.value}>
                        <DatePickerTableCellTrigger>{month.label}</DatePickerTableCellTrigger>
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

/** Preserve native element selection for the composed month grid. */
export const DatePickerMonthTable = DatePickerMonthTableImpl as <
  As extends ComponentIntrinsicElement = 'table',
>(
  props: DatePickerMonthTableProps<As>,
) => JSX.Element;

/** Render the year grid for the active calendar view. */
function DatePickerYearTableImpl(props: DatePickerYearTableProps): JSX.Element {
  const [local, tableProps] = splitProps(props, ['columns', 'children']);
  const datePicker = useDatePickerContext();

  /** Rebuild year rows when the calendar's visible range changes. */
  function yearRows() {
    return datePicker().getYearsGrid({ columns: local.columns ?? 4 });
  }

  return (
    <NativeTable {...tableProps}>
      <DatePickerTableBody>
        <For each={yearRows()}>
          {
            /** Preserve machine-generated year row order. */
            (years) => (
              <DatePickerTableRow>
                <For each={years}>
                  {
                    /** Pair each year label with its selectable calendar value. */
                    (year) => (
                      <DatePickerTableCell value={year.value}>
                        <DatePickerTableCellTrigger>{year.label}</DatePickerTableCellTrigger>
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

/** Preserve native element selection for the composed year grid. */
export const DatePickerYearTable = DatePickerYearTableImpl as <
  As extends ComponentIntrinsicElement = 'table',
>(
  props: DatePickerYearTableProps<As>,
) => JSX.Element;
