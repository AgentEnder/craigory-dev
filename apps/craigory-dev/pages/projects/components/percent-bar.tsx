import { useState, useRef, useEffect } from 'react';

import classes from './percent-bar.module.scss';

export function PercentBar({
  percent,
  label,
  color,
}: {
  percent: number;
  label: string;
  color?: string;
}) {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current || hasBeenVisible) {
      return;
    }
    const instance = new IntersectionObserver(
      ([entry]) => {
        setHasBeenVisible(entry.isIntersecting);
      },
      {
        threshold: 1,
        root: null,
        rootMargin: '0px',
      }
    );
    instance.observe(el.current);
    return () => {
      instance.disconnect();
    };
  }, [el, hasBeenVisible]);

  return (
    <div className={classes['percent-bar']} ref={el}>
      <div
        className={classes['percent-bar-fill']}
        style={{
          width: hasBeenVisible ? `${percent}%` : 0,
          ...(color ? { backgroundColor: color } : {}),
        }}
      >
        <span className={classes['percent-bar-label']}>{percent + '%'}</span>
      </div>
    </div>
  );
}
