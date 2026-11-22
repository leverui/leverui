const categories: Record<string, string> = {
  animations: 'Animation',
  'aspect-ratios': 'Aspect ratio',
  blurs: 'Blur',
  borders: 'Border',
  breakpoints: 'Breakpoint',
  colors: 'Color',
  cursor: 'Cursor',
  durations: 'Duration',
  easings: 'Easing',
  fonts: 'Font',
  'font-sizes': 'Font size',
  'font-weights': 'Font weight',
  'letter-spacings': 'Letter spacing',
  'line-heights': 'Line height',
  radii: 'Radius',
  shadows: 'Shadow',
  sizes: 'Size',
  spacing: 'Spacing',
  'z-index': 'Z-index',
};

/** Turn generated reference filenames into readable page headings. */
export function referenceTitle(filename: string): string {
  const slug = filename.replace(/\.md$/, '');
  if (slug === 'README') return 'Lever UI CSS variables';
  return `${categories[slug] ?? 'Theme'} variables`;
}
