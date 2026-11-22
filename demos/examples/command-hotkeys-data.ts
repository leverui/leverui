import { type Component } from 'solid-js';
import {
  ArchiveIcon,
  ClockIcon,
  ContrastIcon,
  CopyIcon,
  InboxIcon,
  ListChecksIcon,
  PlusIcon,
  UserPlusIcon,
} from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  group: string;
  icon: Component;
  hotkey: string;
  scope?: 'inbox' | 'issue';
}

export const items: Item[] = [
  { label: 'Create issue', value: 'create-issue', group: 'General', icon: PlusIcon, hotkey: 'c' },
  { label: 'Go to inbox', value: 'go-inbox', group: 'General', icon: InboxIcon, hotkey: 'g>i' },
  {
    label: 'Go to my issues',
    value: 'go-my-issues',
    group: 'General',
    icon: ListChecksIcon,
    hotkey: 'g>m',
  },
  {
    label: 'Archive notification',
    value: 'archive',
    group: 'Inbox',
    icon: ArchiveIcon,
    hotkey: 'e',
    scope: 'inbox',
  },
  {
    label: 'Snooze notification',
    value: 'snooze',
    group: 'Inbox',
    icon: ClockIcon,
    hotkey: 'h',
    scope: 'inbox',
  },
  {
    label: 'Assign to me',
    value: 'assign-me',
    group: 'Issue',
    icon: UserPlusIcon,
    hotkey: 'i',
    scope: 'issue',
  },
  {
    label: 'Change status',
    value: 'change-status',
    group: 'Issue',
    icon: ContrastIcon,
    hotkey: 's',
    scope: 'issue',
  },
  {
    label: 'Copy issue ID',
    value: 'copy-id',
    group: 'Issue',
    icon: CopyIcon,
    hotkey: 'mod+.',
    scope: 'issue',
  },
];
