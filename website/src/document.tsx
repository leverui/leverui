import { HydrationScript, type JSX } from '@solidjs/web';

const initialThemeScript = `try {
  const saved = localStorage.getItem('leverui-site-color-mode');
  const mode = saved === 'light' || saved === 'dark'
    ? saved
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-lui-color-mode', mode);
  document.documentElement.style.colorScheme = mode;
} catch {}`;

/** Render the static site's document shell around the route content. */
export default function Document(props: { children?: JSX.Element }): JSX.Element {
  return (
    <html lang="en" data-lui-color-mode="light">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/leverui-symbol-color.svg" type="image/svg+xml" />
        <script>{initialThemeScript}</script>
        <HydrationScript />
      </head>
      <body>
        <div id="app">{props.children}</div>
      </body>
    </html>
  );
}
