import { type Component } from 'solid-js';
import {
  CalculatorIcon,
  ClipboardIcon,
  KanbanIcon,
  MessageSquare,
  PenToolIcon,
  QuoteIcon,
} from '@lucide/solid';
import type { CommandItem } from '../../src';

export interface Item extends CommandItem {
  value: string;
  label: string;
  group: string;
  type: string;
  action: string;
  icon: Component;
}

export const items: Item[] = [
  {
    label: 'Linear',
    value: 'linear',
    group: 'Applications',
    type: 'Application',
    action: 'Open application',
    icon: KanbanIcon,
    keywords: ['issues', 'tasks'],
  },
  {
    label: 'Figma',
    value: 'figma',
    group: 'Applications',
    type: 'Application',
    action: 'Open application',
    icon: PenToolIcon,
    keywords: ['design'],
  },
  {
    label: 'Slack',
    value: 'slack',
    group: 'Applications',
    type: 'Application',
    action: 'Open application',
    icon: MessageSquare,
    keywords: ['chat', 'messages'],
  },
  {
    label: 'Clipboard history',
    value: 'clipboard',
    group: 'Commands',
    type: 'Command',
    action: 'Run command',
    icon: ClipboardIcon,
    keywords: ['paste', 'copy'],
  },
  {
    label: 'Search snippets',
    value: 'snippets',
    group: 'Commands',
    type: 'Command',
    action: 'Run command',
    icon: QuoteIcon,
    keywords: ['text', 'templates'],
  },
  {
    label: 'Calculator',
    value: 'calculator',
    group: 'Commands',
    type: 'Command',
    action: 'Run command',
    icon: CalculatorIcon,
    keywords: ['math', 'convert'],
  },
];
