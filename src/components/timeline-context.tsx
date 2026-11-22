import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const TimelineContext = createContext(false);

/** Scope Timeline parts to their nearest list root. */
export const TimelineContextProvider = TimelineContext;

/** Reject a Timeline part rendered without its root. */
export function requireTimelineRoot(): void {
  if (!useOptionalContext(TimelineContext))
    throw new Error('Timeline parts must be inside TimelineRoot.');
}
