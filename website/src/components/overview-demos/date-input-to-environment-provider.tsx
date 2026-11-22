import {
  Button,
  DateInput,
  DatePicker,
  DownloadTrigger,
  Editable,
  Em,
  EmptyState,
  HStack,
  IconButton,
  Stack,
  Text,
} from '../../../../src';
import { type Component, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon, PopupSurface } from './shared';

const day = DatePicker.parseDate('2026-03-11');
const muted = { color: 'var(--leverui-colors-fg-muted)' };

/** A date typed in as month, day and year. */
function DateInputDemo(): JSX.Element {
  return (
    <DateInput.Root size="sm" defaultValue={[day]}>
      <DateInput.Control>
        <DateInput.Segments />
      </DateInput.Control>
    </DateInput.Root>
  );
}

/** A date field above a picture of one calendar week. */
function DatePickerDemo(): JSX.Element {
  return (
    <Stack gap="1" style={{ width: '100%' }}>
      <DatePicker.Root size="xs" defaultValue={[day]}>
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger>
              <i class="bi bi-calendar3" aria-hidden="true" />
            </DatePicker.Trigger>
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>
      </DatePicker.Root>
      <PopupSurface>
        <Text textStyle="xs">March 2026</Text>
        <HStack gap="1" justify="space-between">
          <For each={['8', '9', '10', '11', '12', '13', '14']}>
            {/** Show one day number, with the chosen day filled in. */}
            {(date) => (
              <Button size="2xs" variant={date === '11' ? 'solid' : 'ghost'}>
                {date}
              </Button>
            )}
          </For>
        </HStack>
      </PopupSurface>
    </Stack>
  );
}

/** A picture of a dialog: a title, one line and two buttons. */
function DialogDemo(): JSX.Element {
  return (
    <PopupSurface width="210px">
      <Stack gap="2">
        <Text textStyle="label">Delete this project?</Text>
        <Text textStyle="xs" style={muted}>
          You cannot undo this.
        </Text>
        <HStack gap="2" justify="flex-end">
          <Button size="2xs" variant="outline">
            Cancel
          </Button>
          <Button size="2xs">Delete</Button>
        </HStack>
      </Stack>
    </PopupSurface>
  );
}

/** A button that saves a small text file. */
function DownloadTriggerDemo(): JSX.Element {
  return (
    <DownloadTrigger
      data="Meeting notes"
      fileName="notes.txt"
      mimeType="text/plain"
      asChild={
        /** Put the download behavior on an outline button. */
        (getProps) => (
          <Button {...getProps()} size="sm" variant="outline">
            <i class="bi bi-download" aria-hidden="true" /> Download
          </Button>
        )
      }
    />
  );
}

/** A picture of a drawer: a panel on the right edge of a dimmed page. */
function DrawerDemo(): JSX.Element {
  return (
    <HStack
      justify="flex-end"
      align="stretch"
      style={{ width: '100%', height: '100%', background: 'var(--leverui-colors-gray-muted)' }}
    >
      <PopupSurface width="60%">
        <Text textStyle="label">Filters</Text>
        <Text textStyle="xs" style={muted}>
          Show open orders only.
        </Text>
      </PopupSurface>
    </HStack>
  );
}

/** A name that can be edited in place, with its edit button. */
function EditableDemo(): JSX.Element {
  return (
    <Editable.Root defaultValue="Mara Ellison" style={{ width: 'auto' }}>
      <Editable.Preview />
      <Editable.Input />
      <Editable.Control>
        <Editable.EditTrigger
          asChild={
            /** Put the edit behavior on a small icon button. */
            (getProps) => (
              <IconButton {...getProps()} aria-label="Edit" variant="ghost" size="xs">
                <i class="bi bi-pencil" aria-hidden="true" />
              </IconButton>
            )
          }
        />
      </Editable.Control>
    </Editable.Root>
  );
}

/** One phrase in a sentence, set in italics. */
function EmDemo(): JSX.Element {
  return (
    <Text>
      We are open <Em>every day</Em> this week.
    </Text>
  );
}

/** An icon and a title for an empty cart. */
function EmptyStateDemo(): JSX.Element {
  return (
    <EmptyState.Root size="sm">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <i class="bi bi-cart" aria-hidden="true" />
        </EmptyState.Indicator>
        <EmptyState.Title>Your cart is empty</EmptyState.Title>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}

/** A provider with nothing to show, so an icon stands in for it. */
function EnvironmentProviderDemo(): JSX.Element {
  return <HelperIcon name="window-stack" />;
}

/** The overview demos for date-input through environment-provider, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'date-input': DateInputDemo,
  'date-picker': DatePickerDemo,
  dialog: DialogDemo,
  'download-trigger': DownloadTriggerDemo,
  drawer: DrawerDemo,
  editable: EditableDemo,
  em: EmDemo,
  'empty-state': EmptyStateDemo,
  'environment-provider': EnvironmentProviderDemo,
};
