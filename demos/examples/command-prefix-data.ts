import { type Component } from 'solid-js';
import { BookIcon, FolderIcon, MoonIcon, PlusIcon, UserIcon } from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  group: string;
  icon: Component;
}

const commands: Item[] = [
  {
    label: 'Create new issue',
    value: 'command-new-issue',
    group: 'Commands',
    icon: PlusIcon,
  },
  {
    label: 'Search documentation',
    value: 'command-search-docs',
    group: 'Commands',
    icon: BookIcon,
  },
  {
    label: 'Toggle dark mode',
    value: 'command-toggle-theme',
    group: 'Commands',
    icon: MoonIcon,
    keywords: ['theme'],
  },
];

const people: Item[] = [
  { label: 'Mara Ellison', value: 'person-mara', group: 'People', icon: UserIcon },
  { label: 'Lena Ortiz', value: 'person-lena', group: 'People', icon: UserIcon },
  { label: 'Jonas Schäfer', value: 'person-jonas', group: 'People', icon: UserIcon },
];

const projects: Item[] = [
  {
    label: 'Design system',
    value: 'project-design-system',
    group: 'Projects',
    icon: FolderIcon,
  },
  { label: 'Marketing site', value: 'project-marketing', group: 'Projects', icon: FolderIcon },
  { label: 'Mobile app', value: 'project-mobile', group: 'Projects', icon: FolderIcon },
];

export const allItems = [...commands, ...people, ...projects];

export const scopes = {
  '>': { label: 'Commands', icon: PlusIcon, items: commands },
  '@': { label: 'People', icon: UserIcon, items: people },
  '#': { label: 'Projects', icon: FolderIcon, items: projects },
};
