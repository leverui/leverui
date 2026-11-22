import { Badge, BarChart, Card, Stat } from '@leverui/components';
import { type JSX } from '@solidjs/web';

const months = [
  { month: 'Jan', revenue: 18, color: 'cyan.solid' },
  { month: 'Feb', revenue: 22, color: 'teal.solid' },
  { month: 'Mar', revenue: 20, color: 'blue.solid' },
  { month: 'Apr', revenue: 27, color: 'purple.solid' },
  { month: 'May', revenue: 31, color: 'pink.solid' },
  { month: 'Jun', revenue: 36, color: 'orange.solid' },
];

/** Show a revenue figure in thousands. */
function thousands(value: number): string {
  return `$${value}k`;
}

/** Six months of revenue as a total and a bar chart. */
export function RevenueCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <div class="home-example-stack">
          <Stat.Root size="sm">
            <Stat.Label>Revenue, last six months</Stat.Label>
            <div class="home-example-row">
              <Stat.ValueText>$154k</Stat.ValueText>
              <Badge colorPalette="green">
                <Stat.UpIndicator />
                18%
              </Badge>
            </div>
          </Stat.Root>
          <BarChart
            data={months}
            xKey="month"
            series={[{ name: 'revenue', color: 'cyan.solid', colorKey: 'color', radius: 4 }]}
            yTickFormatter={thousands}
            height={180}
            tooltip
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
