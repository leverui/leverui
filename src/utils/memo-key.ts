/** Build unambiguous keys for structurally equal plain argument values. */
export function createMemoKey(): (args: readonly unknown[]) => string {
  const objectIds = new WeakMap<object, number>();
  const symbolIds = new Map<symbol, number>();
  let nextId = 0;

  /** Assign a stable identity to a function, instance, or cyclic object. */
  function objectId(value: object): number {
    const existing = objectIds.get(value);
    if (existing !== undefined) return existing;
    const id = ++nextId;
    objectIds.set(value, id);
    return id;
  }

  /** Distinguish symbols even when they share a description. */
  function symbolId(value: symbol): number {
    const existing = symbolIds.get(value);
    if (existing !== undefined) return existing;
    const id = ++nextId;
    symbolIds.set(value, id);
    return id;
  }

  /** Encode one value with explicit type and structural boundaries. */
  function encode(value: unknown, active: WeakSet<object>): unknown {
    if (value === null) return ['null'];
    if (typeof value === 'undefined') return ['undefined'];
    if (typeof value === 'string') return ['string', value];
    if (typeof value === 'number') return ['number', String(value)];
    if (typeof value === 'boolean') return ['boolean', value];
    if (typeof value === 'bigint') return ['bigint', String(value)];
    if (typeof value === 'symbol') return ['symbol', symbolId(value)];
    if (typeof value === 'function') return ['function', objectId(value)];

    const isArray = Array.isArray(value);
    const prototype: unknown = Object.getPrototypeOf(value);
    if (!isArray && prototype !== null && prototype !== Object.prototype) {
      return ['instance', objectId(value)];
    }
    if (active.has(value)) return ['reference', objectId(value)];

    active.add(value);
    const record = value as Record<PropertyKey, unknown>;
    const entries = Reflect.ownKeys(value).map(
      /** Encode both a property key and its current value. */
      (key) => [encode(key, active), encode(record[key], active)],
    );
    active.delete(value);
    return [isArray ? 'array' : 'object', entries];
  }

  /** Encode all arguments as one framed tuple. */
  return function keyForArguments(args: readonly unknown[]): string {
    const active = new WeakSet<object>();
    return JSON.stringify(
      args.map(
        /** Encode one argument in tuple order. */
        (arg) => encode(arg, active),
      ),
    );
  };
}
