export type DialogCommandItem = {
  readonly label: string;
  readonly value: string;
  readonly type: 'applications' | 'commands';
};

/** command palette items in application and command order. */
export const dialogCommands: readonly DialogCommandItem[] = [
  { label: 'Linear.app', value: 'linear', type: 'applications' },
  { label: 'Notion', value: 'notion', type: 'applications' },
  { label: 'Figma', value: 'figma', type: 'applications' },
  { label: 'Slack', value: 'slack', type: 'applications' },
  { label: 'Cursor', value: 'cursor', type: 'applications' },
  { label: 'Open Terminal', value: 'terminal', type: 'commands' },
  { label: 'Search Files', value: 'search', type: 'commands' },
  { label: 'Git Status', value: 'git-status', type: 'commands' },
  { label: 'Run Tests', value: 'run-tests', type: 'commands' },
  { label: 'Deploy App', value: 'deploy', type: 'commands' },
];
