import { type JSX } from '@solidjs/web';
import { Box, Button, Center, Text } from '../../src';
import './sandbox.css';

/** Apply a full-radius wrapper to a self-closing image child. */
export function SandboxSelfClosing(): JSX.Element {
  return (
    <Box
      style={{ 'border-radius': 'var(--lui-radii-full)', overflow: 'hidden' }}
      asChild={
        /** Merge the wrapper's radius and overflow onto the native image. */
        (getProps) => (
          <img {...getProps()} src="/demo-images/avatars/avatar-4.webp" alt="Portrait of a man" />
        )
      }
    />
  );
}

/** Demonstrate the direct button background override. */
export function SandboxLayers(): JSX.Element {
  return <Button style={{ background: 'red' }}>Click me</Button>;
}

/** Combine responsive properties with a sticky subtle fill layer. */
export function SandboxSortOrder(): JSX.Element {
  return (
    <Center class="sandbox-sort-center">
      <Text>Hello</Text>
    </Center>
  );
}

/** Animate the dotted texture between faint and full opacity. */
export function SandboxCustomAnimation(): JSX.Element {
  return (
    <Box style={{ height: '400px', width: '400px', position: 'relative' }}>
      <Box
        data-testid="sandbox-texture"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          'background-size': '20px 20px',
          'background-image': 'radial-gradient(black 0%, transparent 20%)',
          animation: '4s ease-in-out infinite alternate leverui-sandbox-fade',
        }}
      />
    </Box>
  );
}
