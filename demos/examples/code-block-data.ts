/** Preserve the HTML sample and its leading blank line. */
export const htmlFile = {
  code: '\n<div class="container">\n  <h1>Hello, world!</h1>\n</div>\n',
  language: 'html',
  title: 'index.html',
} as const;

/** Preserve the focused TypeScript sample. */
export const focusFile = {
  code: '\nconst greeting = "Hello, World!"\n\nfunction sayHello() {\n  console.log(greeting);\n}\n\nsayHello()\n',
  language: 'tsx',
  title: 'index.tsx',
} as const;

/** Preserve the diff sample and line positions. */
export const diffFile = {
  code: '\nconst greeting = "Hello, World!"; \nfunction sayHello() {\n  console.log("Hello, World!"); \n  console.log(greeting); \n}\nsayHello();\n',
  language: 'tsx',
  title: 'index.tsx',
} as const;

/** Preserve the long-line wrapping sample. */
export const wrappedFile = {
  code: '\nconst greeting = "Hello, World! I am a long line of text that will wrap to the next line."\n\nfunction sayHello() {\n  console.log(greeting)\n}\n\nsayHello()\n',
  language: 'tsx',
  title: 'index.tsx',
} as const;
