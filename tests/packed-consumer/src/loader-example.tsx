import { Loader, LoaderOverlay } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Loader composition with packaged CSS. */
export function PackedLoader(): JSX.Element {
  const [visible, setVisible] = createSignal(true);

  /** Toggle the visible wrapper while retaining the native host. */
  function toggle(): void {
    setVisible(!visible());
  }

  return (
    <>
      <div
        id="packed-loader-native-host"
        style={{ position: 'relative', width: '120px', height: '50px' }}
      >
        <Loader id="packed-loader-native" visible={visible()} text="Working">
          Ready
        </Loader>
        <LoaderOverlay id="packed-loader-native-overlay" class="packed-loader-overlay">
          Overlay
        </LoaderOverlay>
      </div>
      <button id="packed-loader-native-toggle" type="button" onClick={toggle}>
        Toggle
      </button>
    </>
  );
}
