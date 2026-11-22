import { Show as SolidShow, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface ShowProps<T> {
  /** Render children while this value is truthy. */
  when: T | null | undefined;
  /** Render this content while `when` is falsy. */
  fallback?: JSX.Element | undefined;
  /** Read the narrowed truthy value from a Solid accessor. */
  children: JSX.Element | ((value: Accessor<NonNullable<T>>) => JSX.Element);
}

/** Render a conditional branch without adding a DOM wrapper. */
export function Show<T>(props: ShowProps<T>): JSX.Element {
  return (
    <SolidShow when={props.when} fallback={props.fallback}>
      {
        /** Pass the narrowed value to a function child; render other children as they are. */
        (value: Accessor<NonNullable<T>>) => {
          const content = props.children;
          return typeof content === 'function' ? content(value) : content;
        }
      }
    </SolidShow>
  );
}
