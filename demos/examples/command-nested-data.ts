import { type Component } from 'solid-js';
import {
  CircleDashedIcon,
  CopyIcon,
  FolderIcon,
  LinkIcon,
  SignalMediumIcon,
  TagIcon,
  TrashIcon,
  TriangleAlertIcon,
  UserIcon,
  UsersIcon,
} from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Issue {
  status: string;
  priority: string;
  assignee: string;
  labels: string[];
  project: string;
}

export interface Item extends CommandItem {
  label: string;
  value: string;
  icon?: Component;
  colorPalette?: 'gray' | 'blue' | 'orange' | 'purple' | 'green' | 'red' | 'pink' | 'teal';
  avatar?: boolean;
  title?: string;
  placeholder?: string;
  hotkey?: string;
  copy?: string;
  group?: string;
  field?: keyof Issue;
  option?: string;
}

type Choice = Pick<Item, 'label' | 'icon' | 'colorPalette' | 'avatar'> & { option: string };

export const initialIssue: Issue = {
  status: 'in-progress',
  priority: 'high',
  assignee: 'rhea',
  labels: ['bug'],
  project: 'auth',
};

const roots: Item[] = [
  {
    label: 'Change status...',
    value: 'status',
    title: 'Status',
    placeholder: 'Change status...',
    group: 'Change',
    icon: CircleDashedIcon,
    hotkey: 's',
  },
  {
    label: 'Change priority...',
    value: 'priority',
    title: 'Priority',
    placeholder: 'Change priority...',
    group: 'Change',
    icon: SignalMediumIcon,
    hotkey: 'p',
  },
  {
    label: 'Assign to...',
    value: 'assignee',
    title: 'Assignee',
    placeholder: 'Assign to...',
    group: 'Change',
    icon: UserIcon,
    hotkey: 'a',
  },
  {
    label: 'Add labels...',
    value: 'labels',
    title: 'Labels',
    placeholder: 'Add labels...',
    group: 'Change',
    icon: TagIcon,
    hotkey: 'l',
  },
  {
    label: 'Move to project...',
    value: 'project',
    title: 'Project',
    placeholder: 'Pick a team...',
    group: 'Change',
    icon: FolderIcon,
    hotkey: 'shift+p',
  },
  {
    label: 'Copy issue ID',
    value: 'copy-id',
    group: 'Issue',
    icon: CopyIcon,
    hotkey: 'mod+.',
    copy: 'ENG-142',
  },
  {
    label: 'Copy issue URL',
    value: 'copy-url',
    group: 'Issue',
    icon: LinkIcon,
    hotkey: 'mod+shift+,',
    copy: 'https://example.com/issues/ENG-142',
  },
  { label: 'Delete issue', value: 'delete', group: 'Issue', icon: TrashIcon },
];

/** Turn one field's choices into the child items of a page. */
function choices(field: keyof Issue, parent: string, list: Choice[]): Item[] {
  return list.map(
    /** Attach the field, parent page, and close behavior to one choice. */
    (choice) => ({
      ...choice,
      value: `${field}:${choice.option}`,
      parent,
      field,
      closeOnSelect: field !== 'labels',
    }),
  );
}

export const items: Item[] = [
  ...roots,
  ...choices('status', 'status', [
    { label: 'Backlog', option: 'backlog', colorPalette: 'gray' },
    { label: 'Todo', option: 'todo', colorPalette: 'blue' },
    { label: 'In progress', option: 'in-progress', colorPalette: 'orange' },
    { label: 'In review', option: 'in-review', colorPalette: 'purple' },
    { label: 'Done', option: 'done', colorPalette: 'green' },
    { label: 'Canceled', option: 'canceled', colorPalette: 'red' },
  ]),
  ...choices('priority', 'priority', [
    { label: 'No priority', option: 'none', icon: SignalMediumIcon },
    { label: 'Urgent', option: 'urgent', icon: TriangleAlertIcon },
    { label: 'High', option: 'high', icon: SignalMediumIcon },
    { label: 'Medium', option: 'medium', icon: SignalMediumIcon },
    { label: 'Low', option: 'low', icon: SignalMediumIcon },
  ]),
  ...choices('assignee', 'assignee', [
    { label: 'Unassigned', option: 'unassigned', icon: UserIcon },
    { label: 'Rhea Solano', option: 'rhea', avatar: true },
    { label: 'Oskar Brandt', option: 'oskar', avatar: true },
    { label: 'Imani Kerr', option: 'imani', avatar: true },
  ]),
  ...choices('labels', 'labels', [
    { label: 'Bug', option: 'bug', colorPalette: 'red' },
    { label: 'Feature', option: 'feature', colorPalette: 'purple' },
    { label: 'Improvement', option: 'improvement', colorPalette: 'blue' },
    { label: 'Design', option: 'design', colorPalette: 'pink' },
    { label: 'Documentation', option: 'docs', colorPalette: 'teal' },
  ]),
  {
    label: 'Engineering',
    value: 'team:eng',
    parent: 'project',
    placeholder: 'Move to Engineering...',
    icon: UsersIcon,
  },
  {
    label: 'Design',
    value: 'team:design',
    parent: 'project',
    placeholder: 'Move to Design...',
    icon: UsersIcon,
  },
  ...choices('project', 'team:eng', [
    { label: 'Auth revamp', option: 'auth', icon: FolderIcon },
    { label: 'Billing v2', option: 'billing', icon: FolderIcon },
    { label: 'Mobile app', option: 'mobile', icon: FolderIcon },
  ]),
  ...choices('project', 'team:design', [
    { label: 'Design system', option: 'design-system', icon: FolderIcon },
    { label: 'Marketing site', option: 'marketing', icon: FolderIcon },
  ]),
];

export const shortcuts = roots.filter(
  /** Keep only the actions that declare a shortcut key. */
  (item): item is Item & { hotkey: string } => Boolean(item.hotkey),
);
