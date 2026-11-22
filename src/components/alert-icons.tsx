import { type JSX } from '@solidjs/web';

const circle =
  'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z';
const info = 'M11 7H13V9H11V7ZM11 11H13V17H11V11Z';
const warning = 'M11 15H13V17H11V15ZM11 7H13V13H11V7Z';
const success =
  'M11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z';

/** Resolve the shared status glyph path for Alert and Toast. */
export function getStatusIconPath(status: unknown): string | undefined {
  if (status === 'success') return `${circle} ${success}`;
  if (status === 'warning' || status === 'error') return `${circle} ${warning}`;
  if (status === 'info' || status === 'neutral') return `${circle} ${info}`;
  return undefined;
}

/** Render the status glyph as decorative Alert content. */
export function AlertDefaultIcon(props: { status: unknown }): JSX.Element {
  return (
    <>
      {getStatusIconPath(props.status) ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
          <path d={getStatusIconPath(props.status)} />
        </svg>
      ) : null}
    </>
  );
}
