import { type JSX } from '@solidjs/web';
import { radioCardPaymentIconPaths } from './radio-card-guide-payment-paths';

export type RadioCardGuideIconKind =
  | 'arrow'
  | 'blocked'
  | 'lock'
  | 'wallet'
  | 'phone'
  | 'card'
  | 'dollar'
  | 'trend'
  | 'clock'
  | 'check';

/** Adapt Lucide and Remix glyphs into decorative Solid guide symbols. */
export function RadioCardGuideIcon(props: { readonly kind: RadioCardGuideIconKind }): JSX.Element {
  /** Use a filled silhouette for the three Remix payment symbols. */
  function isFilled(): boolean {
    return props.kind === 'wallet' || props.kind === 'phone' || props.kind === 'card';
  }

  /** Select the shape that identifies one option. */
  function drawing(): JSX.Element {
    switch (props.kind) {
      case 'arrow':
        return (
          <>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </>
        );
      case 'blocked':
        return (
          <>
            <path d="m2 2 20 20" />
            <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" />
            <path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" />
          </>
        );
      case 'lock':
        return (
          <>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </>
        );
      case 'wallet':
        return <path fill-rule="evenodd" d={radioCardPaymentIconPaths.wallet} />;
      case 'phone':
        return <path fill-rule="evenodd" d={radioCardPaymentIconPaths.phone} />;
      case 'card':
        return <path d={radioCardPaymentIconPaths.card} />;
      case 'dollar':
        return (
          <>
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </>
        );
      case 'trend':
        return (
          <>
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        );
      case 'check':
        return <path d="M20 6 9 17l-5-5" />;
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={isFilled() ? 'currentColor' : 'none'}
      stroke={isFilled() ? undefined : 'currentColor'}
      stroke-width={isFilled() ? undefined : '2'}
      stroke-linecap={isFilled() ? undefined : 'round'}
      stroke-linejoin={isFilled() ? undefined : 'round'}
      aria-hidden="true"
      data-icon={props.kind}
    >
      {drawing()}
    </svg>
  );
}
