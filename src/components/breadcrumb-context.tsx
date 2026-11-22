import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const BreadcrumbContext = createContext(false);

/** Mark descendants as belonging to the nearest Breadcrumb root. */
export const BreadcrumbContextProvider = BreadcrumbContext;

/** Reject a Breadcrumb part mounted outside its required root. */
export function requireBreadcrumbRoot(): void {
  if (!useOptionalContext(BreadcrumbContext))
    throw new Error('Breadcrumb parts require BreadcrumbRoot.');
}
