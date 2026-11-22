import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  BreadcrumbCurrentLink as CurrentLinkExport,
  BreadcrumbItem as ItemExport,
  BreadcrumbLink as LinkExport,
  BreadcrumbList as ListExport,
  BreadcrumbSeparator as SeparatorExport,
} from '../src/components/breadcrumb-parts';
import type { BreadcrumbRoot as RootExport } from '../src/components/breadcrumb-root';

export interface BreadcrumbHydrationComponents {
  BreadcrumbCurrentLink: typeof CurrentLinkExport;
  BreadcrumbItem: typeof ItemExport;
  BreadcrumbLink: typeof LinkExport;
  BreadcrumbList: typeof ListExport;
  BreadcrumbRoot: typeof RootExport;
  BreadcrumbSeparator: typeof SeparatorExport;
}

/** Build matching server and browser Breadcrumb trees with live size and text. */
export function renderBreadcrumbHydrationTree({
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  BreadcrumbSeparator,
}: BreadcrumbHydrationComponents): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Change the selected size and current location after hydration. */
  function toggleLocation(): void {
    setChanged(!changed());
  }

  return (
    <div>
      <BreadcrumbRoot id="hydrated-breadcrumb" size={changed() ? 'lg' : 'sm'}>
        <BreadcrumbList id="hydrated-breadcrumb-list">
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbCurrentLink id="hydrated-breadcrumb-current">
              {changed() ? 'Account' : 'Settings'}
            </BreadcrumbCurrentLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbRoot>
      <button id="breadcrumb-hydration-toggle" type="button" onClick={toggleLocation}>
        Change location
      </button>
    </div>
  );
}
