import { type JSX } from '@solidjs/web';
import { Alert, type AlertSize, type AlertVariant } from '../../src';
import { PlaygroundMatrix, type ExamplePalette } from './playground-matrix';

const sizes: AlertSize[] = ['sm', 'md', 'lg'];
const variants: AlertVariant[] = ['subtle', 'surface', 'outline', 'solid'];

/** Render one complete Alert for a palette and CSS variant option. */
function AlertDemo(props: {
  size?: AlertSize;
  variant?: AlertVariant;
  colorPalette: ExamplePalette;
}): JSX.Element {
  return (
    <Alert.Root size={props.size} variant={props.variant} colorPalette={props.colorPalette}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Alert title</Alert.Title>
        <Alert.Description>A short line that explains the alert.</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

/** Render one Alert size and color palette combination. */
function renderSize(size: AlertSize, colorPalette: ExamplePalette): JSX.Element {
  return <AlertDemo size={size} colorPalette={colorPalette} />;
}

/** Render one Alert variant and color palette combination. */
function renderVariant(variant: AlertVariant, colorPalette: ExamplePalette): JSX.Element {
  return <AlertDemo variant={variant} colorPalette={colorPalette} />;
}

/** Show every Alert size across all ten color palettes. */
export function AlertSizeTable(): JSX.Element {
  return <PlaygroundMatrix values={sizes} renderCell={renderSize} />;
}

/** Show every Alert variant across all ten color palettes. */
export function AlertVariantTable(): JSX.Element {
  return <PlaygroundMatrix values={variants} renderCell={renderVariant} />;
}
