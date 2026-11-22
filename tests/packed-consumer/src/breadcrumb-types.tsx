import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbRoot,
  type BreadcrumbEllipsisProps,
  type BreadcrumbLinkProps,
  type BreadcrumbListProps,
  type BreadcrumbRootProps,
  type BreadcrumbSeparatorProps,
} from '@leverui/components';
import type * as LeverUIPackage from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type RootAcceptsVariants = ExpectTrue<
  Assignable<{ size: 'lg'; variant: 'underline'; 'aria-label': 'Trail' }, BreadcrumbRootProps>
>;
export type RootRejectsUnknownSize = ExpectFalse<
  Assignable<{ size: 'giant' }, BreadcrumbRootProps>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { color: string } }, BreadcrumbLinkProps>
>;
export type RootObjectCssRejected = ExpectFalse<
  'css' extends keyof BreadcrumbRootProps ? true : false
>;
export type LinkObjectCssRejected = ExpectFalse<
  'css' extends keyof BreadcrumbLinkProps ? true : false
>;
export type ListStylePropRejected = ExpectFalse<
  'gap' extends keyof BreadcrumbListProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<
  'recipe' extends keyof BreadcrumbRootProps ? true : false
>;
export type StyleHookRemoved = ExpectFalse<
  'useBreadcrumbStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type SeparatorIsListItem = ExpectTrue<
  Assignable<{ ref: (element: HTMLLIElement) => void }, BreadcrumbSeparatorProps>
>;
export type EllipsisIsListItem = ExpectTrue<
  Assignable<{ ref: (element: HTMLLIElement) => void }, BreadcrumbEllipsisProps>
>;

/** Exercise direct and compound Breadcrumb exports in an isolated install. */
export function BreadcrumbConsumer(): JSX.Element {
  return (
    <BreadcrumbRoot size="sm" variant="plain">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </BreadcrumbRoot>
  );
}
