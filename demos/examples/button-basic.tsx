import { type JSX } from '@solidjs/web';
import { ArrowRightIcon, ChevronDownIcon, MailIcon, PlusIcon } from '@lucide/solid';
import { Button, ButtonGroup, HStack, Icon, IconButton } from '../../src';

/** Show the default Button with the label. */
export function ButtonBasic(): JSX.Element {
  return <Button>Button</Button>;
}

/** Show native disabled behavior. */
export function ButtonDisabled(): JSX.Element {
  return <Button disabled>Button</Button>;
}

/** Show a disabled link rendered through Button. */
export function ButtonDisabledLink(): JSX.Element {
  return (
    <Button
      asChild={
        /** Supply native link props through Button's Solid child contract. */
        (getProps) => (
          <a
            {...getProps()}
            href="#"
            aria-disabled="true"
            data-disabled=""
            onClick={
              /** Keep the disabled link on the current page. */
              (event) => event.preventDefault()
            }
          >
            Button
          </a>
        )
      }
    />
  );
}

/** Render a semantic link with Button styling. */
export function ButtonAsLink(): JSX.Element {
  return (
    <Button as="a" href="#">
      Button
    </Button>
  );
}

/** Inherit size and variant from a ButtonGroup. */
export function ButtonWithGroup(): JSX.Element {
  return (
    <ButtonGroup size="sm" variant="outline">
      <Button colorPalette="blue">Save</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  );
}

/** Join adjacent outline actions in an attached group. */
export function ButtonWithGroupFlushed(): JSX.Element {
  return (
    <ButtonGroup size="sm" variant="outline" attached>
      <Button variant="outline">Button</Button>
      <IconButton variant="outline" aria-label="More options">
        <ChevronDownIcon />
      </IconButton>
    </ButtonGroup>
  );
}

/** Compose colored icons before and after a Button label. */
export function ButtonWithIconComposition(): JSX.Element {
  return (
    <Button>
      <Icon as="span" style={{ color: 'yellow' }} size="inherit">
        <PlusIcon />
      </Icon>
      Button
      <Icon as="span" style={{ color: 'pink' }} size="inherit">
        <PlusIcon />
      </Icon>
    </Button>
  );
}

/** Place leading and trailing icons in two teal Button variants. */
export function ButtonWithIcons(): JSX.Element {
  return (
    <HStack>
      <Button colorPalette="teal" variant="solid">
        <MailIcon /> Email
      </Button>
      <Button colorPalette="teal" variant="outline">
        Call us <ArrowRightIcon />
      </Button>
    </HStack>
  );
}
