import {
  Box,
  Checkbox,
  Circle,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  Float,
  For,
  FormatByte,
  FormatNumber,
  Grid,
  GridItem,
  HStack,
  Input,
  Separator,
  Text,
} from '../../../../src';
import { type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

/** The plain block that layout demos arrange. */
const block = {
  height: '24px',
  'border-radius': 'var(--leverui-radii-sm)',
  background: 'var(--overview-tint)',
};
const muted = { color: 'var(--leverui-colors-fg-muted)' };
const badge = {
  background: 'var(--leverui-colors-cyan-solid)',
  color: 'var(--leverui-colors-cyan-contrast)',
};

/** A text field with its label and help text. */
function FieldDemo(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input size="sm" placeholder="mara@example.com" />
      <Field.HelperText>We never share it.</Field.HelperText>
    </Field.Root>
  );
}

/** A named group of two checkboxes. */
function FieldsetDemo(): JSX.Element {
  return (
    <Fieldset.Root size="sm">
      <Fieldset.Legend>Notifications</Fieldset.Legend>
      <Fieldset.Content>
        <Checkbox.Root size="sm" defaultChecked>
          <Checkbox.Control />
          <Checkbox.Label>Email</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root size="sm">
          <Checkbox.Control />
          <Checkbox.Label>Text message</Checkbox.Label>
        </Checkbox.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

/** A drop area that asks for files. */
function FileUploadDemo(): JSX.Element {
  return (
    <FileUpload.Root style={{ width: '100%' }}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone style={{ width: '100%', 'min-height': '0', padding: '16px' }}>
        <i class="bi bi-upload" aria-hidden="true" />
        <FileUpload.DropzoneContent>Drop files here</FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}

/** Three blocks in a row, the middle one filling the free space. */
function FlexDemo(): JSX.Element {
  return (
    <Flex align="center" style={{ width: '100%', gap: '8px' }}>
      <Box style={{ ...block, width: '40px' }} />
      <Box style={{ ...block, flex: '1', height: '40px' }} />
      <Box style={{ ...block, width: '40px' }} />
    </Flex>
  );
}

/** A count pinned to the top corner of a block. */
function FloatDemo(): JSX.Element {
  return (
    <Box style={{ ...block, position: 'relative', width: '64px', height: '64px' }}>
      <Float>
        <Circle size="5" textStyle="xs" style={badge}>
          3
        </Circle>
      </Float>
    </Box>
  );
}

/** A picture of a floating panel: a title bar with controls above its content. */
function FloatingPanelDemo(): JSX.Element {
  return (
    <PopupSurface width="200px">
      <HStack gap="2">
        <i class="bi bi-grip-horizontal" aria-hidden="true" />
        <Text textStyle="label" style={{ flex: '1' }}>
          Notes
        </Text>
        <i class="bi bi-dash-lg" aria-hidden="true" />
        <i class="bi bi-x-lg" aria-hidden="true" />
      </HStack>
      <Separator style={{ margin: '6px 0' }} />
      <Text textStyle="xs" style={muted}>
        Drag the title bar to move this panel.
      </Text>
    </PopupSurface>
  );
}

/** One numbered line for each name in a list. */
function ForDemo(): JSX.Element {
  return (
    <div>
      <For each={['Mara Ellison', 'Theo Park', 'Iris Calder']}>
        {/** Show one name after its place in the list. */}
        {(name, index) => (
          <Text textStyle="sm">
            {index() + 1}. {name}
          </Text>
        )}
      </For>
    </div>
  );
}

/** A file size written in megabytes. */
function FormatByteDemo(): JSX.Element {
  return (
    <Text textStyle="2xl">
      <FormatByte value={1500000} />
    </Text>
  );
}

/** A large number written with separators. */
function FormatNumberDemo(): JSX.Element {
  return (
    <Text textStyle="2xl">
      <FormatNumber value={1234567.89} />
    </Text>
  );
}

/** Five blocks in three columns, the first one two columns wide. */
function GridDemo(): JSX.Element {
  return (
    <Grid templateColumns="repeat(3, 1fr)" style={{ width: '100%', gap: '8px' }}>
      <GridItem colSpan={2} style={block} />
      <GridItem style={block} />
      <GridItem style={block} />
      <GridItem style={block} />
      <GridItem style={block} />
    </Grid>
  );
}

/** The overview demos for field through grid, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  field: FieldDemo,
  fieldset: FieldsetDemo,
  'file-upload': FileUploadDemo,
  flex: FlexDemo,
  float: FloatDemo,
  'floating-panel': FloatingPanelDemo,
  for: ForDemo,
  'format-byte': FormatByteDemo,
  'format-number': FormatNumberDemo,
  grid: GridDemo,
};
