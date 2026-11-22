import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const preparations = [
  './prepare-color-picker-hydration.mjs',
  './prepare-combobox-hydration.mjs',
  './prepare-listbox-hydration.mjs',
  './prepare-listbox-guide-hydration.mjs',
  './prepare-listbox-state-guide-hydration.mjs',
  './prepare-listbox-collection-guide-hydration.mjs',
  './prepare-listbox-horizontal-hydration.mjs',
  './prepare-listbox-explorer-hydration.mjs',
  './prepare-listbox-input-hydration.mjs',
  './prepare-listbox-image-explorer-hydration.mjs',
  './prepare-listbox-virtualized-hydration.mjs',
  './prepare-listbox-transfer-hydration.mjs',
  './prepare-listbox-emoji-hydration.mjs',
  './prepare-listbox-presentation-hydration.mjs',
  './prepare-listbox-overlay-hydration.mjs',
  './prepare-listbox-dialog-hydration.mjs',
  './prepare-radio-card-hydration.mjs',
  './prepare-radio-card-guide-explorer-hydration.mjs',
  './prepare-radio-group-hydration.mjs',
  './prepare-rating-group-hydration.mjs',
  './prepare-segment-group-hydration.mjs',
  './prepare-select-hydration.mjs',
  './prepare-slider-hydration.mjs',
  './prepare-switch-hydration.mjs',
  './prepare-tags-input-hydration.mjs',
  './prepare-toggle-hydration.mjs',
  './prepare-clipboard-hydration.mjs',
  './prepare-date-input-hydration.mjs',
  './prepare-date-picker-hydration.mjs',
  './prepare-date-picker-guide-hydration.mjs',
  './prepare-download-trigger-hydration.mjs',
  './prepare-scroll-area-hydration.mjs',
];

for (const preparation of preparations) {
  execFileSync(process.execPath, [fileURLToPath(new URL(preparation, import.meta.url))], {
    stdio: 'inherit',
    env: process.env,
  });
}
