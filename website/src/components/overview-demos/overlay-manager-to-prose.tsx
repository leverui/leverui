import {
  AbsoluteCenter,
  Button,
  ButtonGroup,
  IconButton,
  Pagination,
  PasswordInput,
  PasswordStrengthMeter,
  PinInput,
  ProgressCircle,
  Prose,
  Stack,
  Text,
  usePaginationContext,
} from '../../../../src';
import { type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { HelperIcon, PopupSurface } from './shared';

/** The manager opens overlays from code and shows nothing itself. */
function OverlayManagerDemo(): JSX.Element {
  return <HelperIcon name="layers" />;
}

/** Three pages with the second one current. */
function PaginationDemo(): JSX.Element {
  return (
    <Pagination.Root count={30} pageSize={10} defaultPage={2}>
      <ButtonGroup variant="ghost" size="xs">
        <Pagination.PrevTrigger
          asChild={
            /** Draw the previous-page button. */
            (getProps) => (
              <IconButton {...getProps()}>
                <i class="bi bi-chevron-left" aria-hidden="true" />
              </IconButton>
            )
          }
        />
        <Pagination.Items
          render={
            /** Draw one page number and outline the current page. */
            (page, getProps) => (
              <IconButton
                {...getProps()}
                variant={usePaginationContext()().page === page.value ? 'outline' : 'ghost'}
              >
                {page.value}
              </IconButton>
            )
          }
        />
        <Pagination.NextTrigger
          asChild={
            /** Draw the next-page button. */
            (getProps) => (
              <IconButton {...getProps()}>
                <i class="bi bi-chevron-right" aria-hidden="true" />
              </IconButton>
            )
          }
        />
      </ButtonGroup>
    </Pagination.Root>
  );
}

/** A hidden password above a strength meter. */
function PasswordInputDemo(): JSX.Element {
  return (
    <Stack gap="2" style={{ width: '100%' }}>
      <PasswordInput size="sm" value="open-sesame" aria-label="Password" />
      <PasswordStrengthMeter value={3} />
    </Stack>
  );
}

/** A four-digit code with three digits typed. */
function PinInputDemo(): JSX.Element {
  return (
    <PinInput.Root count={4} size="sm" defaultValue={['4', '8', '2']}>
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** A picture of an open popover under its trigger. */
function PopoverDemo(): JSX.Element {
  return (
    <Stack gap="1" style={{ 'align-items': 'center' }}>
      <Button size="xs" variant="outline">
        Details
      </Button>
      <PopupSurface width="190px">
        <Text textStyle="label">Storage</Text>
        <Text style={{ color: 'var(--leverui-colors-fg-muted)' }}>12 GB of 20 GB used.</Text>
      </PopupSurface>
    </Stack>
  );
}

/** The portal moves content elsewhere and shows nothing itself. */
function PortalDemo(): JSX.Element {
  return <HelperIcon name="window-plus" />;
}

/** Presence only controls when content is shown. */
function PresenceDemo(): JSX.Element {
  return <HelperIcon name="eye" />;
}

/** A ring that is two thirds full, with its value. */
function ProgressCircleDemo(): JSX.Element {
  return (
    <ProgressCircle.Root value={65} size="xl">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <AbsoluteCenter>
        <ProgressCircle.ValueText />
      </AbsoluteCenter>
    </ProgressCircle.Root>
  );
}

/** A heading and a paragraph styled as an article. */
function ProseDemo(): JSX.Element {
  return (
    <Prose style={{ width: '100%' }}>
      <h4>Weekly notes</h4>
      <p>
        Keep each note <strong>short</strong> and <em>easy to find</em>.
      </p>
    </Prose>
  );
}

/** The overview demos for overlay-manager through prose, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'overlay-manager': OverlayManagerDemo,
  pagination: PaginationDemo,
  'password-input': PasswordInputDemo,
  'pin-input': PinInputDemo,
  popover: PopoverDemo,
  portal: PortalDemo,
  presence: PresenceDemo,
  'progress-circle': ProgressCircleDemo,
  prose: ProseDemo,
};
