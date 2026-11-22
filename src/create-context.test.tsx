import { createRoot, createSignal, type Accessor, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { render } from '@solidjs/web';
import { describe, expect, it } from 'vitest';
import { createContext } from './create-context';

describe('createContext', () => {
  it('returns the provider, lookup, and Solid context in order', () => {
    const [Provider, useValue, Context] = createContext<boolean>({ defaultValue: false });

    expect(Provider).toBe(Context);
    expect(createRoot(() => useValue())).toBe(false);
  });

  it('reports a named error only when a strict value is undefined', () => {
    const [, useValue] = createContext<number>({
      hookName: 'useCounter',
      providerName: 'CounterProvider',
    });

    expect(() => createRoot(() => useValue())).toThrowError(
      'useCounter returned `undefined`. Seems you forgot to wrap component within CounterProvider',
    );
    try {
      createRoot(() => useValue());
    } catch (error) {
      expect(error).toMatchObject({ name: 'ContextError' });
    }
  });

  it('allows an absent value when strict mode is disabled', () => {
    const [, useValue] = createContext<number>({ strict: false });
    const value: number | undefined = createRoot(() => useValue());

    expect(value).toBeUndefined();
  });

  it('uses a context name or custom message in missing-provider errors', () => {
    const [, useNamedValue] = createContext<string>({ name: 'NamedProvider' });
    const [, useCustomValue] = createContext<string>({ errorMessage: 'Supply a value.' });

    expect(() => createRoot(() => useNamedValue())).toThrowError('within NamedProvider');
    expect(() => createRoot(() => useCustomValue())).toThrowError('Supply a value.');
  });

  it('keeps a provider-supplied accessor reactive', () => {
    const [Provider, useValue] = createContext<Accessor<number>>();
    const [count, setCount] = createSignal(1);
    const container = document.createElement('div');

    /** Render the current context value inside its provider. */
    function CurrentValue(): JSX.Element {
      return <span>{useValue()()}</span>;
    }

    const dispose = render(
      /** Mount the provider around its Solid consumer. */
      () => (
        <Provider value={count}>
          <CurrentValue />
        </Provider>
      ),
      container,
    );

    expect(container.textContent).toBe('1');
    setCount(2);
    flush();
    expect(container.textContent).toBe('2');
    dispose();
  });
});
