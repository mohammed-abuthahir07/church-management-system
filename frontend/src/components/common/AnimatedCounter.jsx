import React, { useEffect, useState } from 'react';
import { formatIndianCurrency } from '../../utils/currency';

export const AnimatedCounter = ({ value = 0, isCurrency = false, duration = 1200, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = Number(value) || 0;

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    let startTimestamp = null;
    const startValue = 0;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  if (isCurrency) {
    return <span className={className}>{formatIndianCurrency(displayValue)}</span>;
  }

  return (
    <span className={className}>
      {new Intl.NumberFormat('en-IN').format(displayValue)}
    </span>
  );
};
