import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CreditCardIcon } from '@lucide/solid';
import {
  Box,
  cardImages,
  Group,
  Input,
  InputGroup,
  usePaymentInputs,
  type UsePaymentInputsReturn,
} from '../../src';
import './input-payment.css';

/** Show the detected card brand, or a generic card icon until one is detected. */
function CardImage(props: UsePaymentInputsReturn): JSX.Element {
  return (
    <Show when={props.meta.cardType} fallback={<CreditCardIcon />}>
      <svg {...props.getCardImageProps({ images: cardImages })} />
    </Show>
  );
}

/** Join card number, expiry date, and security code fields into one card form. */
export function InputCardDetails(): JSX.Element {
  const payment = usePaymentInputs();
  return (
    <Box class="input-card-details">
      <InputGroup class="input-card-number-group" endElement={<CardImage {...payment} />}>
        <Input class="input-card-square-bottom" {...payment.getCardNumberProps()} />
      </InputGroup>
      <Group style={{ width: '100%' }} attached>
        <Input class="input-card-square-top-left" {...payment.getExpiryDateProps()} />
        <Input class="input-card-square-top-right" {...payment.getCVCProps()} />
      </Group>
    </Box>
  );
}
