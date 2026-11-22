import { type JSX } from '@solidjs/web';
import { AccountCard } from './account-card';
import { ActivityCard } from './activity-card';
import { AppearanceCard } from './appearance-card';
import { NotificationsCard } from './notifications-card';
import { PlanCard } from './plan-card';
import { TasksCard } from './tasks-card';
import { TeamCard } from './team-card';
import { UsageCard } from './usage-card';
import { VisitsCard } from './visits-card';
import '../../styles/home-examples.css';

/** A wall of small working interfaces, each built from Lever UI components. */
export function HomeExamples(): JSX.Element {
  return (
    <div class="home-examples" role="group" aria-label="Live examples">
      <div class="home-examples-column">
        <TeamCard />
        <UsageCard />
        <TasksCard />
      </div>
      <div class="home-examples-column">
        <AccountCard />
        <NotificationsCard />
        <VisitsCard />
      </div>
      <div class="home-examples-column">
        <PlanCard />
        <ActivityCard />
        <AppearanceCard />
      </div>
    </div>
  );
}
