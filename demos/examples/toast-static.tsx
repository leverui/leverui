import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { Box, Spinner, Stack } from '../../src';
import './toast-static.css';
import { CircleAlert, CircleCheck, CircleX, X } from '@lucide/solid';

const staticToasts = [
  { type: 'loading', title: 'Loading...', description: 'Your files are being uploaded.' },
  { type: 'error', title: 'Error', description: 'The upload could not be finished.' },
  { type: 'success', title: 'Success', description: 'Your files were uploaded.' },
  { type: 'warning', title: 'Warning', description: 'Your storage is almost full.' },
] as const;

/** Map each settled status to the indicator icon. */
const statusIcons = {
  error: CircleX,
  success: CircleCheck,
  warning: CircleAlert,
} as const;

/** Display loading, error, success, and warning specimens together. */
export function ToastStatic(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={staticToasts}>
        {
          /** Give each status its own stationary card. */
          (item) => (
            <Box class="toast-static-card" data-type={item.type}>
              {item.type === 'loading' ? (
                <Spinner size="sm" style={{ color: 'red' }} />
              ) : (
                <Dynamic component={statusIcons[item.type]} class="toast-static-icon" />
              )}
              <Stack gap="1" style={{ flex: '1', 'max-width': '100%' }}>
                <Box textStyle="sm" class="toast-static-title">
                  {item.title}
                </Box>
                <Box textStyle="sm" class="toast-static-description">
                  {item.description}
                </Box>
              </Stack>
              <Box as="button" textStyle="sm" class="toast-static-retry">
                Retry
              </Box>
              <Box as="button" aria-label="Close toast" class="toast-static-close">
                <X />
              </Box>
            </Box>
          )
        }
      </For>
    </Stack>
  );
}
