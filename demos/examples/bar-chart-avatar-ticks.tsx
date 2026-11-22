import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';

/** Names, values, and image URLs from the avatar-tick example. */
const people: readonly BarDatum[] = [
  {
    name: 'Mara',
    value: 400,
    avatar: '/demo-images/avatars/avatar-1.webp',
  },
  {
    name: 'Theo',
    value: 300,
    avatar: '/demo-images/avatars/avatar-4.webp',
  },
  {
    name: 'Jonah',
    value: 200,
    avatar: '/demo-images/avatars/avatar-6.webp',
  },
  {
    name: 'Oskar',
    value: 278,
    avatar: '/demo-images/avatars/avatar-2.webp',
  },
];

/** Place a person's image where their category text would appear. */
function avatarTick(row: BarDatum, _index: number, x: number, y: number): JSX.Element {
  const src = typeof row.avatar === 'string' ? row.avatar : '';
  const name = typeof row.name === 'string' ? row.name : '';
  return (
    <foreignObject x={x - 15} y={y - 4} width={40} height={40}>
      <img src={src} alt={name} style={{ width: '30px', height: '30px', 'border-radius': '50%' }} />
    </foreignObject>
  );
}

/** Render the four bars with image-based category ticks. */
export function BarChartWithAvatarTicks(): JSX.Element {
  return (
    <BarChart
      data={people}
      xKey="name"
      series={[{ name: 'value', color: 'teal.solid' }]}
      xTickRenderer={avatarTick}
      yDomain={[0, 400]}
      bottomInset={65}
    />
  );
}
