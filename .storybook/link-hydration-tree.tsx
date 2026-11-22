import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Link as LinkExport,
  LinkBox as BoxExport,
  LinkOverlay as OverlayExport,
  LinkOverlayProps,
  LinkPropsProvider as LinkProviderExport,
} from '../src';

export interface LinkHydrationComponents {
  Link: typeof LinkExport;
  LinkBox: typeof BoxExport;
  LinkOverlay: typeof OverlayExport;
  LinkPropsProvider: typeof LinkProviderExport;
}

type GetChildProps = Parameters<NonNullable<LinkOverlayProps['asChild']>>[0];

/** Build the same Link tree with the published server and browser entries. */
export function renderLinkHydrationTree({
  Link,
  LinkBox,
  LinkOverlay,
  LinkPropsProvider,
}: LinkHydrationComponents): JSX.Element {
  const [underlined, setUnderlined] = createSignal(false);

  /** Give each inheriting anchor its own label node. */
  function renderSharedLabel(): JSX.Element {
    return <span id="hydrated-link-label">Shared destination</span>;
  }

  /** Compose the stretched overlay with a CSS styled Link. */
  function renderOverlayLink(getProps: GetChildProps): JSX.Element {
    return (
      <Link {...getProps()} href="#hydrated-article" id="hydrated-overlay-link">
        Article
      </Link>
    );
  }

  /** Change inherited styling without remounting any anchor. */
  function toggleVariant(): void {
    setUnderlined(!underlined());
  }

  return (
    <LinkPropsProvider
      value={{ variant: underlined() ? 'underline' : 'plain', children: renderSharedLabel }}
    >
      <Link href="#local" id="hydrated-link">
        Local destination
      </Link>
      <Link href="#shared" id="hydrated-shared-link" />
      <Link as="span" id="hydrated-selected-link">
        Selected element
      </Link>
      <LinkBox
        as="article"
        id="hydrated-link-box"
        style={{ width: '320px', height: '140px', padding: '16px' }}
      >
        <LinkOverlay asChild={renderOverlayLink} />
        <a href="#hydrated-inner" id="hydrated-inner-link">
          Inner link
        </a>
      </LinkBox>
      <button type="button" id="link-hydration-toggle" onClick={toggleVariant}>
        Toggle variant
      </button>
    </LinkPropsProvider>
  );
}
