import { type JSX } from '@solidjs/web';
import { Box, Stack } from '../../src';
import './decorative-box.css';

/** Show a successful alert with the selected uppercase treatment. */
export function SystemAlertStyles(): JSX.Element {
  return (
    <div class="consumer-system-inline-alert" data-status="success" data-caps>
      Your changes were saved
    </div>
  );
}

/** Align two differently tall boxes with a consumer layout class. */
export function SystemFlexLayout(): JSX.Element {
  return (
    <div class="consumer-system-flex" data-direction="row" data-align="center">
      <Box class="example-decorative-box" data-decorative-height="10">
        Item 1
      </Box>
      <Box class="example-decorative-box" data-decorative-height="20">
        Item 2
      </Box>
    </div>
  );
}

/** Apply a local bold appearance to a native button. */
export function SystemNativeButton(): JSX.Element {
  return <button class="consumer-system-inline-button">Welcome</button>;
}

/** Combine a selected badge variant with its pressed state. */
export function SystemCompoundBoolean(): JSX.Element {
  return (
    <Stack>
      <div class="consumer-system-badge" data-variant="solid" data-leverui-color-palette="gray">
        Hello
      </div>
      <div
        class="consumer-system-badge"
        data-variant="solid"
        data-pressed
        data-leverui-color-palette="gray"
      >
        Hello
      </div>
    </Stack>
  );
}

/** Select the gray palette and solid variant with finite attributes. */
export function SystemCompoundColorPalette(): JSX.Element {
  return (
    <div class="consumer-system-badge" data-variant="solid" data-leverui-color-palette="gray">
      Hello
    </div>
  );
}
