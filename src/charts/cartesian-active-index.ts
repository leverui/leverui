/** Return an active category only while it exists in the current data. */
export function cartesianActiveIndex(index: number | null, dataLength: number): number | null {
  return index !== null && index >= 0 && index < dataLength ? index : null;
}
