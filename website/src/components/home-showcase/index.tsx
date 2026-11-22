import { type JSX } from '@solidjs/web';
import { BookingCard } from './booking-card';
import { ChatCard } from './chat-card';
import { FaqCard } from './faq-card';
import { FeedbackCard } from './feedback-card';
import { FiltersCard } from './filters-card';
import { OrdersCard } from './orders-card';
import { RevenueCard } from './revenue-card';
import { VerifyCard } from './verify-card';
import '../../styles/home-showcase.css';

/**
 * More working examples below the hero, using components the hero's wall does not show:
 * a chart, a calendar, a code input, a chat, an accordion, filters, a table, a rating.
 */
export function HomeShowcase(): JSX.Element {
  return (
    <section class="home-showcase-section" aria-labelledby="showcase-title">
      <div class="page-container home-showcase-heading">
        <h2 id="showcase-title">Go ahead, click around</h2>
      </div>
      <div class="page-container home-showcase">
        {/* Each column pairs a tall card with a short one, so the columns end near the same line. */}
        <div class="home-showcase-column">
          <BookingCard />
          <FiltersCard />
        </div>
        <div class="home-showcase-column">
          <ChatCard />
          <VerifyCard />
        </div>
        <div class="home-showcase-column">
          <RevenueCard />
          <OrdersCard />
        </div>
        <div class="home-showcase-column">
          <FeedbackCard />
          <FaqCard />
        </div>
      </div>
    </section>
  );
}
