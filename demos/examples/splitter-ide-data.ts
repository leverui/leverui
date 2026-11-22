export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  id?: string;
  children?: FileNode[];
}

export interface EditorFile {
  code: string;
  language: string;
}

export const fileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', type: 'file', id: 'app' },
      { name: 'index.tsx', type: 'file', id: 'index' },
    ],
  },
  { name: 'package.json', type: 'file', id: 'package' },
];

/** Fallback editor file shown when an unknown tree entry is selected. */
export const defaultEditorFile: EditorFile = {
  code: `import { createSignal } from 'solid-js';

export const Counter = () => {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  )
}`,
  language: 'tsx',
};

export const fileContents: Record<string, EditorFile> = {
  app: defaultEditorFile,
  index: {
    code: `import { render } from '@solidjs/web'
import { Counter } from './App'

const root = document.getElementById('root')
if (root) render(() => <Counter />, root)`,
    language: 'tsx',
  },
  package: {
    code: `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "solid-js": "^1.9.0"
  }
}`,
    language: 'json',
  },
};

export const terminalOutput = `$ npm run dev

> dev@1.0.0 dev
> vite

  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`;
