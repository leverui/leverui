import { $PROXY } from 'solid-js';
import type { MergedProps, PropSource } from './merge-props-types';
import { cx } from './utils/cx';

type NativeEvent = (...args: unknown[]) => unknown;
type BoundEvent = readonly [NativeEvent, unknown];
type EventHandler = NativeEvent | BoundEvent;

/** Recognize Solid's tuple form for a bound native event handler. */
function isBoundEvent(value: unknown): value is BoundEvent {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'function';
}

/** Recognize both supported Solid event handler representations. */
function isEventHandler(value: unknown): value is EventHandler {
  return typeof value === 'function' || isBoundEvent(value);
}

/** Include Solid's direct event syntax alongside onEvent-style names. */
function isEventName(name: string): boolean {
  return /^on[A-Z]/.test(name) || /^on:/.test(name) || /^oncapture:/.test(name);
}

/** Invoke a handler with its bound data and native element context. */
function callHandler(handler: EventHandler, element: unknown, args: unknown[]): unknown {
  if (isBoundEvent(handler)) return handler[0].apply(element, [handler[1], ...args]);
  return handler.apply(element, args);
}

/** Call a caller-supplied Solid event handler, plain or bound tuple, when one is present. */
export function invokeEventHandler(handler: unknown, element: unknown, event: Event): void {
  if (isEventHandler(handler)) callHandler(handler, element, [event]);
}

/** Join class names in source order without changing either source. */
function joinClasses(first: unknown, second: unknown): string {
  return cx(first, second);
}

/** Run both native handlers in source order for the same event. */
function combineEvents(first: EventHandler, second: EventHandler): NativeEvent {
  /** Preserve Solid's element context and bound tuple data. */
  return function callBoth(this: unknown, ...args: unknown[]): void {
    callHandler(first, this, args);
    callHandler(second, this, args);
  };
}

/** Merge one value according to its class, style, or event contract. */
function mergeValue(name: string, first: unknown, second: unknown): unknown {
  if (name === 'class' || name === 'className') return joinClasses(first, second);
  if (name === 'style') {
    if (second == null) return first;
    if (first && typeof first === 'object' && typeof second === 'object') {
      return { ...first, ...second };
    }
  }
  if (isEventName(name) && isEventHandler(first) && isEventHandler(second)) {
    return combineEvents(first, second);
  }
  return second;
}

/** Resolve an object or its current reactive accessor value. */
function readSource(source: PropSource): object {
  return typeof source === 'function' ? source() : source;
}

/** Check a source's own key without reading its value, which may be a getter. */
function hasOwnKey(source: object, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(source, name);
}

/**
 * Fold one key across the sources: the first source that has it sets the
 * value, a later `undefined` keeps it, and a later value merges by the
 * class, style, and event rules. Only this key's getters run, so reading
 * `ref` never evaluates `children` (Solid 2 forbids creating components in
 * the effect phase, where refs run).
 */
function readMergedKey(sources: PropSource[], name: string): unknown {
  let found = false;
  let result: unknown;
  for (const source of sources) {
    const value = readSource(source);
    if (!hasOwnKey(value, name)) continue;
    const next: unknown = Reflect.get(value, name);
    if (!found) {
      found = true;
      result = next;
      continue;
    }
    if (next === undefined) continue;
    result = mergeValue(name, result, next);
  }
  return result;
}

/** Check whether any source has a key. */
function hasMergedKey(sources: PropSource[], name: string): boolean {
  return sources.some(
    /** Look for the key without reading its value. */
    (source) => hasOwnKey(readSource(source), name),
  );
}

/** List every source's enumerable keys in first-seen order without reading values. */
function mergedKeys(sources: PropSource[]): string[] {
  const keys = new Set<string>();
  for (const source of sources) for (const key of Object.keys(readSource(source))) keys.add(key);
  return [...keys];
}

/** Merge reactive Solid props with ordered classes, styles, and handlers. */
export function mergeProps<Sources extends PropSource[]>(
  ...sources: Sources
): MergedProps<Sources> {
  // Reads go to the sources one key at a time, so tracking is per key. Only
  // string keys are props; symbols such as Solid's internal markers are not.
  return new Proxy(Object.create(null) as object, {
    /** Read one merged key through the sources. */
    get(_target, key, receiver) {
      if (key === $PROXY) return receiver;
      return typeof key === 'string' ? readMergedKey(sources, key) : undefined;
    },
    /** Report whether a source has the key. */
    has(_target, key) {
      if (key === $PROXY) return true;
      return typeof key === 'string' && hasMergedKey(sources, key);
    },
    /** List the merged keys. */
    ownKeys: () => mergedKeys(sources),
    /** Describe a key as a live, enumerable getter. */
    getOwnPropertyDescriptor(_target, key) {
      if (typeof key !== 'string' || !hasMergedKey(sources, key)) return undefined;
      return {
        configurable: true,
        enumerable: true,
        /** Read the key through the sources. */
        get: () => readMergedKey(sources, key),
      };
    },
    /** Ignore writes; the view is read-only. */
    set: () => true,
    /** Ignore deletes; the view is read-only. */
    deleteProperty: () => true,
  }) as MergedProps<Sources>;
}
