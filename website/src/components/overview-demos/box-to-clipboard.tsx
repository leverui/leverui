import {
  Box,
  Breadcrumb,
  Carousel,
  Center,
  CheckboxCard,
  Checkmark,
  Circle,
  Clipboard,
  DatePicker,
  HStack,
  Input,
  InputGroup,
} from '../../../../src';
import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon } from './shared';

const tint = 'var(--overview-tint)';

/** One plain block with a little padding. */
function BoxDemo(): JSX.Element {
  return <Box style={{ padding: '16px 32px', background: tint }}>Box</Box>;
}

/** A trail of three pages, ending on the current one. */
function BreadcrumbDemo(): JSX.Element {
  return (
    <Breadcrumb.Root size="sm">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Orders</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Invoice</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

/** The first two weeks of a month, with one day picked. */
function CalendarDemo(): JSX.Element {
  const sizes = { '--leverui-date-picker-cell-size': '28px' };
  return (
    <DatePicker.Root inline defaultValue={[DatePicker.parseDate('2026-02-11')]} style={sizes}>
      <DatePicker.View view="day">
        <DatePicker.Header />
        <DatePicker.Table>
          <DatePicker.TableBody>
            <DatePicker.Context>
              {/** Draw only the first two weeks, so the month fits the card. */}
              {(picker) => (
                <For each={picker().weeks.slice(0, 2)}>
                  {/** One row of seven days. */}
                  {(week) => (
                    <DatePicker.TableRow>
                      <For each={week}>
                        {/** One day of the week. */}
                        {(day) => (
                          <DatePicker.TableCell value={day}>
                            <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        )}
                      </For>
                    </DatePicker.TableRow>
                  )}
                </For>
              )}
            </DatePicker.Context>
          </DatePicker.TableBody>
        </DatePicker.Table>
      </DatePicker.View>
    </DatePicker.Root>
  );
}

/** Three plain slides, showing the first, with dots below. */
function CarouselDemo(): JSX.Element {
  return (
    <Carousel.Root count={3} style={{ width: '180px' }}>
      <Carousel.ItemGroup>
        <For each={[0, 1, 2]}>
          {/** One plain slide. */}
          {(index) => <Carousel.Item index={index} style={{ height: '56px', background: tint }} />}
        </For>
      </Carousel.ItemGroup>
      <Carousel.Indicators />
    </Carousel.Root>
  );
}

/** A round badge in the middle of a wide block. */
function CenterDemo(): JSX.Element {
  return (
    <Center
      style={{ width: '100%', height: '88px', background: 'var(--leverui-colors-gray-muted)' }}
    >
      <Circle size="10" style={{ background: tint }}>
        <i class="bi bi-star" aria-hidden="true" />
      </Circle>
    </Center>
  );
}

/** One checked card with a title and a line of detail. */
function CheckboxCardDemo(): JSX.Element {
  return (
    <CheckboxCard.Root defaultChecked size="sm" style={{ width: '100%' }}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Weekly digest</CheckboxCard.Label>
          <CheckboxCard.Description>One email each Monday</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}

/** The checked, partly checked and empty marks. */
function CheckmarkDemo(): JSX.Element {
  return (
    <HStack gap="4">
      <Checkmark checked />
      <Checkmark indeterminate />
      <Checkmark />
    </HStack>
  );
}

/** ClientOnly draws nothing of its own. */
function ClientOnlyDemo(): JSX.Element {
  return <HelperIcon name="window" />;
}

/** A link in a read-only field with a copy button. */
function ClipboardDemo(): JSX.Element {
  return (
    <Clipboard.Root value="https://leverui.com/docs" style={{ width: '100%' }}>
      <InputGroup
        endElement={
          <Clipboard.Trigger>
            <Clipboard.Indicator />
          </Clipboard.Trigger>
        }
      >
        <Clipboard.Input
          asChild={
            /** Show the value in a styled input. */
            (getProps) => <Input {...getProps()} size="sm" />
          }
        />
      </InputGroup>
    </Clipboard.Root>
  );
}

/** The overview demos for box through clipboard, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  box: BoxDemo,
  breadcrumb: BreadcrumbDemo,
  calendar: CalendarDemo,
  carousel: CarouselDemo,
  center: CenterDemo,
  'checkbox-card': CheckboxCardDemo,
  checkmark: CheckmarkDemo,
  'client-only': ClientOnlyDemo,
  clipboard: ClipboardDemo,
};
