import { type Component } from 'solid-js';
import { CopyIcon, FileTextIcon, PencilIcon, ShareIcon, TrashIcon, XIcon } from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  folder: string;
  icon: Component;
}

const actions = [
  { label: 'Open', icon: FileTextIcon },
  { label: 'Rename', icon: PencilIcon },
  { label: 'Duplicate', icon: CopyIcon },
  { label: 'Share', icon: ShareIcon },
  { label: 'Close', icon: XIcon },
  { label: 'Delete', icon: TrashIcon },
];

const folders = ['Design', 'Engineering', 'Marketing', 'Finance', 'Legal'];

export const items: Item[] = Array.from(
  { length: 5000 },
  /** Pair each document with one of the six actions in turn. */
  (_, index) => {
    const action = actions[index % actions.length] ?? {
      label: 'Open',
      icon: FileTextIcon,
    };
    const documentIndex = Math.floor(index / actions.length);
    const file = `document-${String(documentIndex + 1).padStart(3, '0')}`;
    return {
      label: `${action.label} ${file}`,
      value: `${action.label.toLowerCase()}-${file}`,
      folder: folders[documentIndex % folders.length] ?? 'Design',
      icon: action.icon,
    };
  },
);
