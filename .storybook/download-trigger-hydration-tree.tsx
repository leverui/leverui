import { type JSX } from '@solidjs/web';
import type { DownloadTrigger as TriggerExport } from '../src';

export type DownloadTriggerHydrationComponents = {
  DownloadTrigger: typeof TriggerExport;
};

/** Share one native download button across published server and browser entries. */
export function renderDownloadTriggerHydrationTree({
  DownloadTrigger,
}: DownloadTriggerHydrationComponents): JSX.Element {
  const Trigger = DownloadTrigger;
  return (
    <Trigger data="hydrated download content" fileName="hydrated.txt" mimeType="text/plain">
      Hydrated download
    </Trigger>
  );
}
