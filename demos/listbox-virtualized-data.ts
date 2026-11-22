import { countriesADKW } from './listbox-virtualized-countries-ad-kw';
import { countriesKYZW } from './listbox-virtualized-countries-ky-zw';

/** The complete country collection from the local Listbox guide example. */
export const countries = [...countriesADKW, ...countriesKYZW];

/** Shared dimensions and range policy for the mounted and visual examples. */
export const virtualizedListboxConfig = {
  rowHeight: 32,
  overscan: 10,
  viewportHeight: 300,
  viewportWidth: 384,
} as const;
