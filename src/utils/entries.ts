/** Maps object entries while preserving their string key union. */
export function mapEntries<A, B, K extends string>(
  obj: { [key in K]: A },
  f: (key: K, val: A) => [K, B],
): { [key in K]: B } {
  const result = Object.create(null) as { [key in K]: B };
  for (const key of Object.keys(obj) as K[]) {
    const kv = f(key, obj[key]);
    result[kv[0]] = kv[1];
  }
  return result;
}
