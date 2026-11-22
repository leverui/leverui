import * as marquee from '@zag-js/marquee';

const trackDimensions = marquee.machine.implementations?.effects?.trackDimensions;
if (!trackDimensions) throw new Error('The Marquee machine must track dimensions.');

/** Recalculate animation duration when Zag observes changed dimensions. */
export const responsiveMarqueeMachine: typeof marquee.machine = {
  ...marquee.machine,
  implementations: {
    ...marquee.machine.implementations,
    effects: {
      ...marquee.machine.implementations?.effects,
      /** Extend Zag's dimension effect without changing its measurement logic. */
      trackDimensions(params) {
        const refs = new Proxy(params.refs, {
          /** Update after measured dimensions change following initial setup. */
          get(target, property, receiver) {
            if (property !== 'set') return Reflect.get(target, property, receiver);

            /** Refresh the derived multiplier through Zag's own action. */
            return (...args: Parameters<typeof target.set>) => {
              target.set(...args);
              if (args[0] === 'dimensions' && target.get('initialDurationSet')) {
                params.action(['recalculateDuration']);
              }
            };
          },
        });
        return trackDimensions({ ...params, refs });
      },
    },
  },
};
