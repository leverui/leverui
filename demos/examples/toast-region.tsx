import { onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Toaster } from '../../src';

let owner: symbol | undefined;

/** Render the shared `<Toaster />` once per page, as an app renders it once at its root. */
function SharedToaster(): JSX.Element {
  const id = Symbol('toaster');
  owner ??= id;
  onCleanup(
    /** Let a later story mount the region after this one leaves. */
    () => {
      if (owner === id) owner = undefined;
    },
  );
  return <>{owner === id && <Toaster />}</>;
}

/** Show each toast example with the one shared notification region. */
export function withToaster(Story: () => JSX.Element): JSX.Element {
  return (
    <>
      <Story />
      <SharedToaster />
    </>
  );
}
