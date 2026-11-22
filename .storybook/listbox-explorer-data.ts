import type { FrameworkIconKind } from './listbox-presentation-data';

export type ListboxExplorerItem = {
  readonly label: string;
  readonly value: string;
  readonly category: 'JavaScript' | 'Books' | 'Movies';
  readonly icon?: FrameworkIconKind;
};

/** Explorer records in their grouped presentation order. */
export const explorerItems: readonly ListboxExplorerItem[] = [
  { label: 'React.js', value: 'react', icon: 'atom', category: 'JavaScript' },
  { label: 'SolidJS', value: 'solid', icon: 'sparkles', category: 'JavaScript' },
  { label: 'Vue.js', value: 'vue', icon: 'palette', category: 'JavaScript' },
  { label: 'Angular', value: 'angular', icon: 'globe', category: 'JavaScript' },
  { label: 'Svelte', value: 'svelte', icon: 'zap', category: 'JavaScript' },
  { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
  { label: 'Saltwind', value: 'saltwind', category: 'Books' },
  { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
  { label: 'The Last Lighthouse', value: 'the-last-lighthouse', category: 'Movies' },
];
