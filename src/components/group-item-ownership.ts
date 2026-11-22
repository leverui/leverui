import { groupVariables } from './group-names';
import type { GroupItemElement } from './group-items';

type GroupVariable = 'count' | 'index';
type ManagedValue = { value: string; priority: string };
type ManagedAttribute = { previous: string | null; applied: string | null };

interface GroupItemOwnership {
  /** Track a direct child while the Group controls its position. */
  track(child: GroupItemElement): void;
  /** Write a marker and preserve the latest consumer value for cleanup. */
  writeAttribute(child: GroupItemElement, name: string, next: string | null): void;
  /** Write a generated variable without overwriting a consumer value. */
  writeVariable(child: GroupItemElement, key: GroupVariable, next?: string): void;
  /** Release tracked children absent from the active root. */
  releaseMissing(current: ReadonlySet<GroupItemElement>): void;
  /** Release every child when its Group is disposed. */
  dispose(): void;
}

/** Manage only the attributes and inline variables written by one Group. */
export function createGroupItemOwnership(): GroupItemOwnership {
  const tracked = new Set<GroupItemElement>();
  const variables = new WeakMap<GroupItemElement, Partial<Record<GroupVariable, ManagedValue>>>();
  const attributes = new WeakMap<GroupItemElement, Map<string, ManagedAttribute>>();

  /** Record a direct child so moving or disposing it can restore owned writes. */
  function track(child: GroupItemElement): void {
    tracked.add(child);
  }

  /** Set a marker while remembering the latest consumer-authored value. */
  function writeAttribute(child: GroupItemElement, name: string, next: string | null): void {
    const state = attributes.get(child) ?? new Map<string, ManagedAttribute>();
    const current = child.getAttribute(name);
    const managed = state.get(name);
    if (current === next) {
      if (managed && current !== managed.applied) state.delete(name);
      return;
    }
    const previous = managed && current === managed.applied ? managed.previous : current;
    state.set(name, { previous, applied: next });
    attributes.set(child, state);
    if (next === null) child.removeAttribute(name);
    else child.setAttribute(name, next);
  }

  /** Update a generated custom property without replacing a consumer value. */
  function writeVariable(child: GroupItemElement, key: GroupVariable, next?: string): void {
    const state = variables.get(child) ?? {};
    const previous = state[key];
    const property = groupVariables[key];
    const current = child.style.getPropertyValue(property);
    const priority = child.style.getPropertyPriority(property);
    const isOurs =
      previous !== undefined && current === previous.value && priority === previous.priority;

    if (next === undefined) {
      if (isOurs) child.style.removeProperty(property);
      delete state[key];
    } else if (!current || isOurs) {
      child.style.setProperty(property, next);
      state[key] = { value: next, priority: '' };
    } else {
      delete state[key];
    }
    variables.set(child, state);
  }

  /** Restore one former child only where this Group still owns the value. */
  function release(child: GroupItemElement): void {
    for (const [name, managed] of attributes.get(child) ?? []) {
      if (child.getAttribute(name) !== managed.applied) continue;
      if (managed.previous === null) child.removeAttribute(name);
      else child.setAttribute(name, managed.previous);
    }
    attributes.delete(child);
    writeVariable(child, 'count');
    writeVariable(child, 'index');
    variables.delete(child);
    tracked.delete(child);
  }

  /** Release tracked children that no longer belong to the current root. */
  function releaseMissing(current: ReadonlySet<GroupItemElement>): void {
    for (const child of tracked) {
      if (!current.has(child)) release(child);
    }
  }

  /** Restore owned DOM state when the Group is disposed. */
  function dispose(): void {
    for (const child of tracked) release(child);
  }

  return { track, writeAttribute, writeVariable, releaseMissing, dispose };
}
