import { type Component } from 'solid-js';
import {
  CalendarIcon,
  MessageSquare,
  PenToolIcon,
  GitPullRequestIcon,
  RocketIcon,
  UserIcon,
  UserPlusIcon,
} from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  label: string;
  value: string;
  description: string;
  category: string;
  icon: Component;
}

export const items: Item[] = [
  {
    label: 'Figma',
    value: 'figma',
    description: 'Design workspace',
    category: 'apps',
    icon: PenToolIcon,
  },
  {
    label: 'Slack',
    value: 'slack',
    description: 'Team chat',
    category: 'apps',
    icon: MessageSquare,
  },
  {
    label: 'Calendar',
    value: 'calendar',
    description: "Today's schedule",
    category: 'apps',
    icon: CalendarIcon,
  },
  {
    label: 'Create pull request',
    value: 'create-pr',
    description: 'From current branch',
    category: 'actions',
    icon: GitPullRequestIcon,
    keywords: ['branch', 'review'],
  },
  {
    label: 'Deploy to production',
    value: 'deploy',
    description: 'Ship the latest build',
    category: 'actions',
    icon: RocketIcon,
    keywords: ['release', 'ship'],
  },
  {
    label: 'Invite teammate',
    value: 'invite',
    description: 'Send a workspace invite',
    category: 'actions',
    icon: UserPlusIcon,
    keywords: ['member', 'add'],
  },
  {
    label: 'Mara Ellison',
    value: 'mara',
    description: 'Design engineer',
    category: 'people',
    icon: UserIcon,
  },
  {
    label: 'Lena Ortiz',
    value: 'lena',
    description: 'Product designer',
    category: 'people',
    icon: UserIcon,
  },
];
