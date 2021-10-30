import { useEffect, useRef } from 'react';

const useInterval = (
  callback: (...args: any[]) => void,
  delay?: number | null
) => {
  const savedCallback = useRef<(...args: any[]) => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      savedCallback.current(); // immediately
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
};

export default useInterval;
