import { createContext, mergeProps, mergeRefs, useLiveRef } from '@leverui/components';
import type { LiveRef, UseListCollectionReturn } from '@leverui/components';

export type ConsumerCollection<T> = UseListCollectionReturn<T>;
export const currentValue: LiveRef<string> = useLiveRef(
  /** Read the consumer's current value through the public accessor contract. */
  () => 'current',
);

/** Accept the mounted element through a consumer callback ref. */
function receiveElement(element: HTMLDivElement): void {
  element.dataset.mounted = 'true';
}

export const mergedRef = mergeRefs<HTMLDivElement>(receiveElement, undefined);
export const mergedProps = mergeProps(
  { class: 'default', style: { color: 'red' } },
  { class: 'instance', style: { color: 'blue' } },
);
export const [ValueProvider, useValue, ValueContext] = createContext<number>({ defaultValue: 0 });

export const optionalStyles = mergeProps(
  { style: { padding: '4px' } },
  {} as { style?: { color: string } },
);
export const preservedPadding: string = optionalStyles.style.padding;
export const optionalColorIsGuaranteed: 'color' extends keyof typeof optionalStyles.style
  ? true
  : false = false;

/** Prevent the default action when Solid supplies matching bound data. */
function receiveBoundClick(data: string, event: Event): void {
  if (data === 'bound') event.preventDefault();
}

const boundClick = [receiveBoundClick, 'bound'] as const;
export const optionalClick = mergeProps(
  { onClick: boundClick },
  {} as { onClick?: (event: Event) => void },
);
export const optionalClickIsAlwaysCallable: typeof optionalClick.onClick extends (
  ...args: infer Arguments
) => unknown
  ? Arguments extends unknown[]
    ? true
    : false
  : false = false;

export const joinedClass = mergeProps(
  { class: 'default' } as const,
  { class: 'instance' } as const,
);
export const joinedClassIsLastLiteral: typeof joinedClass.class extends 'instance' ? true : false =
  false;
