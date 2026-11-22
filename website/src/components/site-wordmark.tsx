import { type JSX } from '@solidjs/web';

/** Show the supplied Lever UI wordmark with contrast for each site mode. */
export function SiteWordmark(): JSX.Element {
  return (
    <>
      <img class="wordmark-light" src="/leverui-wordmark-color.svg" alt="" />
      <img class="wordmark-dark" src="/leverui-wordmark-on-dark.svg" alt="" />
    </>
  );
}
