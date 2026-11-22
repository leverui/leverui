import { getCardTypeByValue } from './card-types';

/** Group a card number's digits with spaces where its brand puts them. */
export function formatCardNumber(cardNumber: string): string {
  const cardType = getCardTypeByValue(cardNumber);
  if (!cardType) return (cardNumber.match(/\d+/g) ?? []).join('');
  const { format } = cardType;
  if (format.global) return (cardNumber.match(format) ?? []).join(' ');
  const groups = format.exec(cardNumber.split(' ').join(''));
  if (!groups) return cardNumber;
  return groups
    .slice(1, 4)
    .filter(
      /** Keep the groups that have digits. */
      (group): group is string => Boolean(group),
    )
    .join(' ');
}

/**
 * Format an expiry date as `MM / YY` while the reader types.
 *
 * `inserted` is the text the edit inserted (`InputEvent.data`). Without it, as for a deletion,
 * a lone month keeps no trailing separator so Backspace can remove the slash.
 */
export function formatExpiry(value: string, inserted?: string | null): string {
  const previous = value.split(' / ').join('/');
  if (!previous) return '';
  let expiry = previous;
  if (/^[2-9]$/.test(expiry)) expiry = `0${expiry}`;
  if (previous.length === 2 && Number(previous) > 12) {
    expiry = `0${previous.slice(0, 1)}/${previous.slice(1)}`;
  }
  if (/^1[/-]$/.test(expiry)) return '01 / ';
  const parts = expiry.match(/(\d{1,2})/g) ?? [];
  if (parts.length === 1) {
    if (!inserted && previous.includes('/')) return parts[0] ?? '';
    if (/\d{2}/.test(parts[0] ?? '')) return `${parts[0]} / `;
  }
  if (parts.length > 2) {
    const [, month = '', year = ''] = /^(\d{2}).*(\d{2})$/.exec(parts.join('')) ?? [];
    return [month, year].join(' / ');
  }
  return parts.join(' / ');
}
