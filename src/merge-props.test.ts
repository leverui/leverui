import { createSignal, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { mergeRecipeProps } from './components/recipe-props-merge';
import { mergeProps } from './merge-props';

describe('mergeProps', () => {
  it('preserves defaults while merging classes, object styles, and ordered events', () => {
    const calls: string[] = [];
    const event = { type: 'click' };
    const element = {};
    const merged = mergeProps(
      {
        id: 'first',
        placeholder: undefined,
        class: ' first ',
        style: { color: 'red', padding: '4px' },
        /** Record the first source's event notification. */
        onClick() {
          calls.push('first');
        },
      },
      {
        id: undefined,
        class: ' second ',
        style: { color: 'blue' },
        /** Record the second source's event notification. */
        onClick() {
          calls.push('second');
          return 'handled';
        },
      },
      { style: null },
    );

    expect(merged.id).toBe('first');
    expect(Object.keys(merged)).toContain('placeholder');
    expect(merged.class).toBe('first second');
    expect(merged.style).toEqual({ color: 'blue', padding: '4px' });
    expect(merged.style.padding).toBe('4px');
    expect(Reflect.apply(merged.onClick, element, [event])).toBeUndefined();
    expect(calls).toEqual(['first', 'second']);
    const eventResult: void = merged.onClick();
    expect(eventResult).toBeUndefined();
  });

  it('supports Solid tuple handlers and direct event names', () => {
    const calls: string[] = [];
    const event = { type: 'click' };
    const element = {};
    const merged = mergeProps(
      {
        'on:click': [
          /** Receive Solid's bound data before the native event. */
          function onBound(this: unknown, data: string, received: typeof event): void {
            expect(this).toBe(element);
            expect(received).toBe(event);
            calls.push(data);
          },
          'bound',
        ] as const,
      },
      {
        /** Receive the same event after the bound handler. */
        'on:click': function onDirect(this: unknown, received: typeof event): void {
          expect(this).toBe(element);
          expect(received).toBe(event);
          calls.push('direct');
        },
      },
    );

    Reflect.apply(merged['on:click'], element, [event]);
    expect(calls).toEqual(['bound', 'direct']);
  });

  it('reads current Solid values through the merged proxy', () => {
    {
      const [tone, setTone] = createSignal('red');
      const merged = mergeProps(
        /** Supply the current class and style for each reactive read. */
        () => ({ class: tone(), style: { color: tone() } }),
        { class: 'fixed' },
      );

      expect(merged.class).toBe('red fixed');
      expect(merged.style).toEqual({ color: 'red' });
      setTone('blue');
      flush();
      expect(merged.class).toBe('blue fixed');
      expect(merged.style).toEqual({ color: 'blue' });
    }
  });

  it('types and invokes a pair of Solid bound event tuples as one callback', () => {
    const calls: string[] = [];
    const first = [
      /** Record the first bound event's data. */
      (data: string, event: Event): void => {
        expect(event.type).toBe('click');
        calls.push(data);
      },
      'first',
    ] as const;
    const second = [
      /** Record the second bound event's data. */
      (data: string, event: Event): void => {
        expect(event.type).toBe('click');
        calls.push(data);
      },
      'second',
    ] as const;
    const merged = mergeProps({ onClick: first }, { onClick: second });
    const result: void = merged.onClick(new Event('click'));

    expect(result).toBeUndefined();
    expect(calls).toEqual(['first', 'second']);
  });

  it('keeps provider defaults reactive through the shared merge', () => {
    {
      const [tone, setTone] = createSignal('red');
      const merged = mergeRecipeProps(() => ({ class: tone() }), { class: 'instance' });

      expect(merged.class).toBe('red instance');
      setTone('blue');
      flush();
      expect(merged.class).toBe('blue instance');
    }
  });
});
