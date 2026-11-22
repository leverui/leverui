import { type Component } from 'solid-js';
import { BoxIcon, PlusIcon, SettingsIcon, UsersIcon } from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  icon?: Component;
  kind?: 'person' | 'product';
  description?: string;
  title?: string;
  placeholder?: string;
}

export const items: Item[] = [
  {
    label: 'Search people...',
    value: 'people',
    page: true,
    title: 'People',
    placeholder: 'Search people by name...',
    icon: UsersIcon,
  },
  {
    label: 'Search products...',
    value: 'products',
    page: true,
    title: 'Products',
    placeholder: 'Search products...',
    icon: BoxIcon,
  },
  { label: 'Create project', value: 'create-project', icon: PlusIcon },
  { label: 'Open settings', value: 'settings', icon: SettingsIcon },
];
