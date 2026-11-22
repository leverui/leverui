import { type JSX } from '@solidjs/web';
import {
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Span,
  Stack,
  Text,
  type LinkOverlayProps,
} from '../../src';
import './link-overlay-examples.css';

type GetOverlayProps = Parameters<NonNullable<LinkOverlayProps['asChild']>>[0];

/** Place the styled Link inside the stretched overlay. */
function renderOverlayLink(getProps: GetOverlayProps): JSX.Element {
  return (
    <Link {...getProps()} href="#" variant="underline">
      Click me
    </Link>
  );
}

/** Stretch a visible link across the adjacent heading and description. */
export function LinkOverlayBasic(): JSX.Element {
  return (
    <Stack class="example-link-overlay-area">
      <Heading as="h4">Want to try it?</Heading>
      <Text class="example-link-overlay-muted">
        This whole area is a link. Click anywhere in it to follow the link.
      </Text>
      <LinkOverlay asChild={renderOverlayLink} />
    </Stack>
  );
}

/** Keep the article overlay and its independent inner link. */
export function LinkOverlayArticle(): JSX.Element {
  return (
    <LinkBox as="article" class="example-link-overlay-article">
      <Span
        asChild={
          /** Render the article's published time without losing Span styles. */
          (getProps) => (
            <time {...getProps()} datetime="2021-01-15 15:30:00 +0000 UTC">
              13 days ago
            </time>
          )
        }
        class="example-link-overlay-time"
      />
      <Heading size="lg" class="example-link-overlay-title">
        <LinkOverlay href="#">Lever UI theming workshop</LinkOverlay>
      </Heading>
      <Text class="example-link-overlay-muted example-link-overlay-summary">
        Spend an afternoon learning how to set the colors, spacing, and type for a whole app with
        theme variables.
      </Text>
      <Link href="#inner-link" variant="underline" colorPalette="teal">
        Inner link
      </Link>
    </LinkBox>
  );
}
