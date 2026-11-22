import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { MousePointerIcon } from '@lucide/solid';
import {
  Button,
  ButtonGroup,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  Stack,
  VStack,
} from '../../src';

/** Compare loading buttons with and without replacement text. */
export function ButtonWithLoading(): JSX.Element {
  return (
    <Stack direction="row" gap="4" align="center">
      <Button loading>Click me</Button>
      <Button loading loadingText="Saving...">
        Click me
      </Button>
    </Stack>
  );
}

/** Toggle a loading Button from both the action and a Checkbox. */
export function ButtonWithLoadingToggle(): JSX.Element {
  const [loading, setLoading] = createSignal(false);

  /** Switch the shared loading state. */
  function toggleLoading(): void {
    setLoading(!loading());
  }

  return (
    <VStack gap="4">
      <Button loading={loading()} onClick={toggleLoading}>
        <MousePointerIcon /> Click me
      </Button>
      <CheckboxRoot size="sm" checked={loading()} onCheckedChange={toggleLoading}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Loading</CheckboxLabel>
      </CheckboxRoot>
    </VStack>
  );
}

/** Replace the standard spinner with a three-dot indicator. */
export function ButtonWithCustomSpinner(): JSX.Element {
  return (
    <Button
      loading
      colorPalette="blue"
      spinner={
        <span class="example-beat-spinner" aria-label="Loading">
          <span data-beat="1" />
          <span data-beat="2" />
          <span data-beat="3" />
        </span>
      }
    >
      Click me
    </Button>
  );
}

/** Compare start and end spinner placements in one ButtonGroup. */
export function ButtonWithSpinnerPlacement(): JSX.Element {
  return (
    <ButtonGroup colorPalette="teal">
      <Button loading loadingText="Loading" spinnerPlacement="start">
        Submit
      </Button>
      <Button loading loadingText="Loading" spinnerPlacement="end">
        Continue
      </Button>
    </ButtonGroup>
  );
}
