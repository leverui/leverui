export const overlayBreakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export const overlayDownBreakpoints = ['2xlDown', 'xlDown', 'lgDown', 'mdDown', 'smDown'] as const;
export type OverlayBreakpoint =
  (typeof overlayBreakpoints)[number] | (typeof overlayDownBreakpoints)[number];
export type OverlayChoice<T extends string | boolean> = Partial<Record<OverlayBreakpoint, T>> & {
  base: T;
};

const supported = new Set<string>([...overlayBreakpoints, ...overlayDownBreakpoints]);

/** Validate a finite scalar, array, or breakpoint object before CSS reflection. */
function readFiniteChoice<T extends string | boolean>(
  value: unknown,
  allowed: (candidate: unknown) => candidate is T,
  fallback: T,
): OverlayChoice<T> | undefined {
  if (value === undefined) return { base: fallback };
  if (allowed(value)) return { base: value };
  const result: OverlayChoice<T> = { base: fallback };
  if (Array.isArray(value)) {
    if (value.length > overlayBreakpoints.length) return undefined;
    for (const [index, choice] of value.entries()) {
      if (choice === null || choice === undefined) continue;
      if (!allowed(choice)) return undefined;
      const name = overlayBreakpoints[index];
      if (!name) return undefined;
      result[name] = choice;
    }
    return result;
  }
  if (!value || typeof value !== 'object') return undefined;
  for (const [name, choice] of Object.entries(value)) {
    if (!supported.has(name)) return undefined;
    if (choice === undefined) continue;
    if (!allowed(choice)) return undefined;
    // The supported set narrows this external object key to an overlay breakpoint.
    result[name as OverlayBreakpoint] = choice;
  }
  return result;
}

/** Keep only documented finite overlay string choices. */
export function readOverlayChoice(
  value: unknown,
  allowed: ReadonlySet<string>,
  fallback: string,
): OverlayChoice<string> | undefined {
  /** Match a scalar string against this component's supported choices. */
  function isAllowed(candidate: unknown): candidate is string {
    return typeof candidate === 'string' && allowed.has(candidate);
  }
  return readFiniteChoice(value, isAllowed, fallback);
}

/** Keep responsive boolean choices for overlay inset behavior. */
export function readOverlayBooleanChoice(value: unknown): OverlayChoice<boolean> | undefined {
  /** Accept only boolean values at every selected breakpoint. */
  function isBoolean(candidate: unknown): candidate is boolean {
    return typeof candidate === 'boolean';
  }
  return readFiniteChoice(value, isBoolean, false);
}
