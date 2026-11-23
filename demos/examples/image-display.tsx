import { type JSX } from '@solidjs/web';
import { Image } from '../../src';

/** Display the rounded profile portrait. */
export function ImageBasic(): JSX.Element {
  return (
    <Image
      style={{ 'border-radius': 'var(--lui-radii-md)' }}
      src="/demo-images/avatars/avatar-2.webp"
      alt="Oskar Brandt"
    />
  );
}

/** Crop a portrait into the 150px circle. */
export function ImageCircular(): JSX.Element {
  return (
    <Image
      src="/demo-images/avatars/avatar-4.webp"
      style={{ width: '150px', height: '150px', 'border-radius': '9999px' }}
      fit="cover"
      alt="Theo Park"
    />
  );
}

/** Constrain the image to a four-to-three aspect ratio. */
export function ImageWithAspectRatio(): JSX.Element {
  return (
    <Image
      src="/demo-images/scenes/mountains.webp"
      alt="Mountain landscape"
      style={{ 'aspect-ratio': '4 / 3', width: '300px' }}
    />
  );
}

/** Contain a portrait inside a bordered 300-by-200 box. */
export function ImageWithFit(): JSX.Element {
  return (
    <Image
      style={{
        border: '1px solid red',
        'border-radius': 'var(--lui-radii-md)',
        height: '200px',
        width: '300px',
      }}
      fit="contain"
      src="/demo-images/avatars/avatar-4.webp"
      alt=""
    />
  );
}

/** Set a CSS height while preserving the source image. */
export function ImageWithHeight(): JSX.Element {
  return <Image style={{ height: '200px' }} src="/demo-images/avatars/avatar-3.webp" alt="" />;
}

/** Set native width and height attributes on a profile image. */
export function ImageWithHtmlHeight(): JSX.Element {
  return (
    <Image htmlWidth="400px" htmlHeight="400px" src="/demo-images/avatars/avatar-1.webp" alt="" />
  );
}
