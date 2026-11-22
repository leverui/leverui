/** Match the guide's stable pastel color for a tag value. */
export function tagsInputGuideColor(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }
  const magnitude = Math.abs(hash);
  return `hsl(${magnitude % 360},${60 + (magnitude % 20)}%,${85 + (magnitude % 10)}%)`;
}
