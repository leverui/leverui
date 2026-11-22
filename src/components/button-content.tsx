import { type JSX } from '@solidjs/web';
import { Loader } from './loader';
import type { ButtonRootProps } from './button-props';

type ContentProps = Pick<
  ButtonRootProps,
  'asChild' | 'children' | 'loading' | 'loadingText' | 'spinner' | 'spinnerPlacement'
>;

/** Show loading content on owned buttons while preserving caller-owned children. */
export function buttonContent(props: ContentProps): JSX.Element {
  return (
    <>
      {props.loading && !props.asChild ? (
        <Loader
          spinner={props.spinner}
          spinnerPlacement={props.spinnerPlacement}
          text={props.loadingText}
        >
          {props.children}
        </Loader>
      ) : (
        props.children
      )}
    </>
  );
}
