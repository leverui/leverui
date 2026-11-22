import { Breadcrumb } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise published navigation parts and reactive defaults in an installed app. */
export function PackedBreadcrumb(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the mounted list's inherited text scale. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <Breadcrumb.PropsProvider value={{ size: large() ? 'lg' : 'sm' }}>
        <Breadcrumb.Root id="packed-breadcrumb">
          <Breadcrumb.List id="packed-breadcrumb-list">
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href="/docs"
                class="packed-breadcrumb-link"
                id="packed-breadcrumb-link"
              >
                Docs
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink id="packed-breadcrumb-current">
                Components
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Breadcrumb.PropsProvider>
      <button id="packed-breadcrumb-toggle" type="button" onClick={toggleSize}>
        Change breadcrumb size
      </button>
    </>
  );
}
