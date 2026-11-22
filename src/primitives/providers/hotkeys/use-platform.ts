import { isApple, isLinux } from '@zag-js/dom-query';
import { type Accessor, createSignal, onSettled } from 'solid-js';

import type { Platform } from '@zag-js/hotkeys';

export type { Platform };

/** Detect. */
const detect = (): Platform => {
  if (isApple()) return 'mac';
  if (isLinux()) return 'linux';
  return 'windows';
};

/** Create the platform state and return its API. */
export const usePlatform = (): Accessor<Platform> => {
  const [platform, setPlatform] = createSignal<Platform>('windows');

  onSettled(() => {
    setPlatform(detect());
  });

  return platform;
};
