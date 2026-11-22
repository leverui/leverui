import { type JSX } from '@solidjs/web';
import { Box } from '../../src';

interface TokenDocProps {
  title?: string;
  action?: JSX.Element;
  children?: JSX.Element;
  mt?: '8';
  my?: '8';
}

/** Frame a token specimen with consistent heading and card spacing. */
export function TokenDoc(props: TokenDocProps): JSX.Element {
  return (
    <Box
      style={{
        background: 'var(--leverui-colors-bg)',
        'border-radius': 'var(--leverui-radii-lg)',
        'border-width': '0.5px',
        'margin-top': props.mt ? 'var(--leverui-spacing-8)' : undefined,
        'margin-block': props.my ? 'var(--leverui-spacing-8)' : undefined,
      }}
    >
      <Box style={{ padding: 'var(--leverui-spacing-6)', 'padding-bottom': '0' }}>
        {props.title && (
          <Box
            as="h2"
            style={{
              'font-weight': 'var(--leverui-font-weights-medium)',
              'font-size': 'var(--leverui-font-sizes-sm)',
            }}
          >
            {props.title}
          </Box>
        )}
        {props.action}
      </Box>
      <Box style={{ padding: 'var(--leverui-spacing-6)' }}>{props.children}</Box>
    </Box>
  );
}
