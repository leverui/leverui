import type { CardImages } from '../payment-types';
import { AmexCardImage } from './amex';
import { DinersClubCardImage } from './diners-club';
import { DiscoverCardImage } from './discover';
import { HipercardCardImage } from './hipercard';
import { JcbCardImage } from './jcb';
import { MastercardCardImage } from './mastercard';
import { PlaceholderCardImage } from './placeholder';
import { TroyCardImage } from './troy';
import { UnionPayCardImage } from './unionpay';
import { VisaCardImage } from './visa';

/** Brand marks for `getCardImageProps({ images: cardImages })`; other brands use the placeholder. */
export const cardImages: CardImages = {
  amex: AmexCardImage,
  dinersclub: DinersClubCardImage,
  discover: DiscoverCardImage,
  hipercard: HipercardCardImage,
  jcb: JcbCardImage,
  mastercard: MastercardCardImage,
  placeholder: PlaceholderCardImage,
  troy: TroyCardImage,
  unionpay: UnionPayCardImage,
  visa: VisaCardImage,
};
