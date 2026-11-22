import {
  Link,
  LinkBox,
  LinkOverlay,
  LinkPropsProvider,
  type LinkOverlayProps,
  type LinkProps,
} from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetLinkProps = Parameters<NonNullable<LinkProps<'a'>['asChild']>>[0];
type GetOverlayProps = Parameters<NonNullable<LinkOverlayProps<'a'>['asChild']>>[0];

/** Give each installed Link its own inherited label element. */
function renderSharedLabel(): JSX.Element {
  return <span>Shared destination</span>;
}

/** Render a consumer-owned router anchor through the published Link type. */
function renderRoute(getProps: GetLinkProps): JSX.Element {
  return (
    <a {...getProps()} id="packed-link-route">
      Route
    </a>
  );
}

/** Compose the stretched overlay with the published Link component. */
function renderOverlayLink(getProps: GetOverlayProps): JSX.Element {
  return (
    <Link {...getProps()} href="#packed-article" id="packed-link-overlay">
      Article
    </Link>
  );
}

/** Record that the installed Link forwarded its native anchor ref. */
function markLinkRef(element: HTMLAnchorElement): void {
  element.dataset.refTag = element.tagName.toLowerCase();
}

/** Exercise installed Link exports, provider updates, navigation, and CSS. */
export function PackedLink(): JSX.Element {
  const [underlined, setUnderlined] = createSignal(false);

  /** Change the inherited variant without remounting its anchor. */
  function toggleVariant(): void {
    setUnderlined(!underlined());
  }

  return (
    <section>
      <LinkPropsProvider
        value={{ variant: underlined() ? 'underline' : 'plain', children: renderSharedLabel }}
      >
        <Link href="#packed-shared" id="packed-link-shared" ref={markLinkRef} />
        <Link href="#packed-local" id="packed-link-local" variant="underline">
          Local destination
        </Link>
        <Link asChild={renderRoute} href="#packed-route" />
      </LinkPropsProvider>
      <LinkBox
        as="article"
        id="packed-link-box"
        style={{ width: '320px', height: '160px', padding: '16px' }}
      >
        <LinkOverlay asChild={renderOverlayLink} />
        <a href="#packed-inner" id="packed-link-inner">
          Inner destination
        </a>
      </LinkBox>
      <div class="packed-link-css">
        <LinkBox id="packed-link-override-box">
          <LinkOverlay id="packed-link-override-overlay" href="#packed-override">
            Overridden card
          </LinkOverlay>
        </LinkBox>
      </div>
      <button id="packed-link-toggle" type="button" onClick={toggleVariant}>
        Change Link variant
      </button>
    </section>
  );
}
