/** A card brand's number layout and security-code rules. */
export interface CardType {
  readonly displayName: string;
  readonly type: CardBrand;
  /** Groups the digits; a global pattern repeats, otherwise its captures are the groups. */
  readonly format: RegExp;
  readonly startPattern: RegExp;
  readonly gaps: readonly number[];
  readonly lengths: readonly number[];
  readonly code: { readonly name: string; readonly length: number };
}

/** The card brands that `getCardTypeByValue` recognizes. */
export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'dinersclub'
  | 'discover'
  | 'jcb'
  | 'unionpay'
  | 'maestro'
  | 'elo'
  | 'hipercard'
  | 'troy';

export const DEFAULT_CVC_LENGTH = 3;
export const DEFAULT_ZIP_LENGTH = 5;
export const DEFAULT_CARD_FORMAT = /(\d{1,4})/g;

const fourGroups = [4, 8, 12] as const;

/**
 * Card brands in match order. A number takes the first brand whose start pattern it matches,
 * so the narrower Elo and Hipercard ranges follow the brands they overlap.
 */
export const CARD_TYPES: readonly CardType[] = [
  {
    displayName: 'Visa',
    type: 'visa',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^4/,
    gaps: fourGroups,
    lengths: [16, 18, 19],
    code: { name: 'CVV', length: 3 },
  },
  {
    displayName: 'Mastercard',
    type: 'mastercard',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
    gaps: fourGroups,
    lengths: [16],
    code: { name: 'CVC', length: 3 },
  },
  {
    displayName: 'American Express',
    type: 'amex',
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    startPattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: { name: 'CID', length: 4 },
  },
  {
    displayName: 'Diners Club',
    type: 'dinersclub',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(36|38|30[0-5])/,
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: { name: 'CVV', length: 3 },
  },
  {
    displayName: 'Discover',
    type: 'discover',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(6011|65|64[4-9]|622)/,
    gaps: fourGroups,
    lengths: [16, 19],
    code: { name: 'CID', length: 3 },
  },
  {
    displayName: 'JCB',
    type: 'jcb',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^35/,
    gaps: fourGroups,
    lengths: [16, 17, 18, 19],
    code: { name: 'CVV', length: 3 },
  },
  {
    displayName: 'UnionPay',
    type: 'unionpay',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^62/,
    gaps: fourGroups,
    lengths: [14, 15, 16, 17, 18, 19],
    code: { name: 'CVN', length: 3 },
  },
  {
    displayName: 'Maestro',
    type: 'maestro',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(5018|5020|5038|6304|6703|6708|6759|676[1-3])/,
    gaps: fourGroups,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: { name: 'CVC', length: 3 },
  },
  {
    displayName: 'Elo',
    type: 'elo',
    format: DEFAULT_CARD_FORMAT,
    startPattern:
      /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021)/,
    gaps: fourGroups,
    lengths: [16],
    code: { name: 'CVE', length: 3 },
  },
  {
    displayName: 'Hipercard',
    type: 'hipercard',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
    gaps: fourGroups,
    lengths: [16],
    code: { name: 'CVC', length: 3 },
  },
  {
    displayName: 'Troy',
    type: 'troy',
    format: DEFAULT_CARD_FORMAT,
    startPattern: /^9792/,
    gaps: fourGroups,
    lengths: [16],
    code: { name: 'CVV', length: 3 },
  },
];

/** Find the brand of a card number, or of the digits typed so far. */
export function getCardTypeByValue(value: string): CardType | undefined {
  return CARD_TYPES.find(
    /** Match the number's leading digits against one brand. */
    (cardType) => cardType.startPattern.test(value),
  );
}

/** Look up a brand's rules by its `type` key. */
export function getCardTypeByType(type: string): CardType | undefined {
  return CARD_TYPES.find(
    /** Compare one brand's key. */
    (cardType) => cardType.type === type,
  );
}
