/** @vitest-environment jsdom */
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tab, Tabs } from './Tabs';

// jsdom has no layout engine, so the sliding pill cannot measure itself. That
// is presentation only; everything asserted here is behaviour.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof ResizeObserver;
});

function Fixture({ initial = 'a' }: { initial?: string }) {
  const [tab, setTab] = useState(initial);
  return (
    <Tabs value={tab} onChange={setTab}>
      <Tab id="a" label="Alpha">
        <p>alpha panel</p>
      </Tab>
      <Tab id="b" label="Beta">
        <p>beta panel</p>
      </Tab>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a button per tab', () => {
    render(<Fixture />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Beta' })).toBeDefined();
  });

  it('renders only the active panel', () => {
    render(<Fixture />);
    expect(screen.getByText('alpha panel')).toBeDefined();
    expect(screen.queryByText('beta panel')).toBeNull();
  });

  it('switches panels on click', () => {
    render(<Fixture />);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByText('beta panel')).toBeDefined();
    expect(screen.queryByText('alpha panel')).toBeNull();
  });

  it('marks the active tab for assistive tech', () => {
    render(<Fixture />);
    expect(
      screen.getByRole('tab', { name: 'Alpha' }).getAttribute('aria-selected')
    ).toBe('true');
    expect(
      screen.getByRole('tab', { name: 'Beta' }).getAttribute('aria-selected')
    ).toBe('false');
  });

  it('is controlled — it does not move on its own', () => {
    const onChange = vi.fn();
    render(
      <Tabs value="a" onChange={onChange}>
        <Tab id="a" label="Alpha">
          <p>alpha panel</p>
        </Tab>
        <Tab id="b" label="Beta">
          <p>beta panel</p>
        </Tab>
      </Tabs>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onChange).toHaveBeenCalledWith('b');
    // Value did not change, so the panel must not have either.
    expect(screen.getByText('alpha panel')).toBeDefined();
  });

  it('does not fire onChange for the already-active tab', () => {
    const onChange = vi.fn();
    render(
      <Tabs value="a" onChange={onChange}>
        <Tab id="a" label="Alpha">
          <p>alpha panel</p>
        </Tab>
      </Tabs>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Alpha' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('uncontrolled mode', () => {
    function Bare({ defaultValue }: { defaultValue?: string } = {}) {
      return (
        <Tabs defaultValue={defaultValue}>
          <Tab id="a" label="Alpha">
            <p>alpha panel</p>
          </Tab>
          <Tab id="b" label="Beta">
            <p>beta panel</p>
          </Tab>
        </Tabs>
      );
    }

    it('falls back to the first declared tab', () => {
      render(<Bare />);
      expect(screen.getByText('alpha panel')).toBeDefined();
    });

    it('honours defaultValue', () => {
      render(<Bare defaultValue="b" />);
      expect(screen.getByText('beta panel')).toBeDefined();
    });

    it('switches on its own, with no wiring', () => {
      render(<Bare />);
      fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
      expect(screen.getByText('beta panel')).toBeDefined();
      expect(screen.queryByText('alpha panel')).toBeNull();
    });

    it('still reports changes to an onChange observer', () => {
      const onChange = vi.fn();
      render(
        <Tabs onChange={onChange}>
          <Tab id="a" label="Alpha">
            <p>alpha panel</p>
          </Tab>
          <Tab id="b" label="Beta">
            <p>beta panel</p>
          </Tab>
        </Tabs>
      );
      fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
      expect(onChange).toHaveBeenCalledWith('b');
      // Observing must not turn it into a controlled component.
      expect(screen.getByText('beta panel')).toBeDefined();
    });
  });

  describe('keyboard navigation', () => {
    it('moves right and wraps', () => {
      render(<Fixture />);
      const list = screen.getByRole('tablist');
      fireEvent.keyDown(list, { key: 'ArrowRight' });
      expect(screen.getByText('beta panel')).toBeDefined();
      fireEvent.keyDown(list, { key: 'ArrowRight' });
      expect(screen.getByText('alpha panel')).toBeDefined();
    });

    it('moves left and wraps backwards', () => {
      render(<Fixture />);
      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });
      expect(screen.getByText('beta panel')).toBeDefined();
    });

    it('ignores unrelated keys', () => {
      render(<Fixture />);
      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Enter' });
      expect(screen.getByText('alpha panel')).toBeDefined();
    });
  });

  describe('panel isolation', () => {
    function Boom(): never {
      throw new Error('panel exploded');
    }

    it('contains a throwing panel instead of taking down the page', () => {
      render(
        <Tabs value="bad" onChange={() => undefined}>
          <Tab id="bad" label="Bad">
            <Boom />
          </Tab>
        </Tabs>
      );
      expect(screen.getByText('Something went wrong')).toBeDefined();
      // The tab bar survives, so the user can navigate away.
      expect(screen.getByRole('tab', { name: 'Bad' })).toBeDefined();
    });

    it('gives the next panel a clean mount after one throws', () => {
      function Fix() {
        const [tab, setTab] = useState('bad');
        return (
          <Tabs value={tab} onChange={setTab}>
            <Tab id="bad" label="Bad">
              <Boom />
            </Tab>
            <Tab id="ok" label="Ok">
              <p>ok panel</p>
            </Tab>
          </Tabs>
        );
      }
      render(<Fix />);
      expect(screen.getByText('Something went wrong')).toBeDefined();
      fireEvent.click(screen.getByRole('tab', { name: 'Ok' }));
      expect(screen.getByText('ok panel')).toBeDefined();
      expect(screen.queryByText('Something went wrong')).toBeNull();
    });
  });
});
