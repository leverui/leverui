import { type JSX } from '@solidjs/web';
import { ExternalLinkIcon } from '@lucide/solid';
import { Link, Stack, Text } from '../../src';

/** Show the plain link with Lever UI copy. */
export function LinkBasic(): JSX.Element {
  return <Link href="#">Visit Lever UI</Link>;
}

/** Show the underline and plain Link treatments. */
export function LinkVariants(): JSX.Element {
  return (
    <Stack>
      <Link variant="underline" href="#">
        Link (underline)
      </Link>
      <Link variant="plain" href="#">
        Link (plain)
      </Link>
    </Stack>
  );
}

/** Keep a styled website link within an ordinary text sentence. */
export function LinkWithinText(): JSX.Element {
  return (
    <Text>
      Visit the{' '}
      <Link variant="underline" href="https://leverui.com" colorPalette="teal">
        Lever UI
      </Link>{' '}
      website
    </Text>
  );
}

/** Mark a link as leaving the site with a decorative icon. */
export function LinkWithExternal(): JSX.Element {
  return (
    <Link href="#">
      Visit Lever UI <ExternalLinkIcon />
    </Link>
  );
}
