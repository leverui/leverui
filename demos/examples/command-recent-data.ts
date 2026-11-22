import { type Component } from 'solid-js';
import {
  CopyIcon,
  FilePlusIcon,
  FolderOpenIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  TerminalIcon,
} from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  group: string;
  icon: Component;
  shortcut: string[];
}

export const items: Item[] = [
  {
    label: 'New file',
    value: 'new-file',
    group: 'Commands',
    icon: FilePlusIcon,
    shortcut: ['⌘', 'N'],
  },
  {
    label: 'Open file',
    value: 'open-file',
    group: 'Commands',
    icon: FolderOpenIcon,
    shortcut: ['⌘', 'O'],
  },
  {
    label: 'Save file',
    value: 'save-file',
    group: 'Commands',
    icon: SaveIcon,
    shortcut: ['⌘', 'S'],
  },
  {
    label: 'Copy selection',
    value: 'copy',
    group: 'Commands',
    icon: CopyIcon,
    shortcut: ['⌘', 'C'],
  },
  {
    label: 'Search in files',
    value: 'search',
    group: 'Commands',
    icon: SearchIcon,
    shortcut: ['⇧', '⌘', 'F'],
  },
  {
    label: 'Open terminal',
    value: 'terminal',
    group: 'Commands',
    icon: TerminalIcon,
    shortcut: ['⌃', '`'],
  },
  {
    label: 'Open settings',
    value: 'settings',
    group: 'Commands',
    icon: SettingsIcon,
    shortcut: ['⌘', ','],
  },
];
