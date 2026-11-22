import { DataList } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise published semantic parts and reactive defaults in an installed app. */
export function PackedDataList(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Change the mounted list's inherited orientation. */
  function toggleOrientation(): void {
    setHorizontal(!horizontal());
  }

  return (
    <>
      <DataList.PropsProvider value={{ orientation: horizontal() ? 'horizontal' : 'vertical' }}>
        <DataList.Root id="packed-data-list">
          <DataList.Item id="packed-data-list-item">
            <DataList.ItemLabel id="packed-data-list-label">Status</DataList.ItemLabel>
            <DataList.ItemValue id="packed-data-list-value">Active</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </DataList.PropsProvider>
      <button id="packed-data-list-toggle" type="button" onClick={toggleOrientation}>
        Change list orientation
      </button>
    </>
  );
}
